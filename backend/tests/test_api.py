import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.db import Base, get_db

# Use local testing SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Proactively recreate database schemas for testing
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override FastAPI get_db dependency
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def test_setup():
    # Setup test suite
    yield
    # Dispose of engine to release database lock on Windows
    engine.dispose()
    # Cleanup database
    import os
    if os.path.exists("./test.db"):
        try:
            os.remove("./test.db")
        except PermissionError:
            pass


def test_public_user_registration(test_setup):
    """
    Test public signup creates a business, user, default ai configuration,
    and a pending subscription plan.
    """
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testowner@example.com",
            "password": "securepassword123",
            "business_name": "Test Salon Shop",
            "business_type": "Salon"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testowner@example.com"
    assert data["role"] == "Owner"
    assert data["is_active"] is False  # Must remain inactive until billing is configured


def test_login_retrieves_jwt(test_setup):
    """
    Test login returns JWT token.
    """
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "testowner@example.com",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_inactive_user_cannot_access_crm(test_setup):
    """
    Test that users without an active subscription plan are blocked from accessing CRM.
    """
    # 1. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testowner@example.com", "password": "securepassword123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Access CRM (should receive 402 Payment Required)
    response = client.get("/api/v1/customers/", headers=headers)
    assert response.status_code == 402
    assert "Subscription required" in response.json()["detail"]


def test_billing_plan_activation(test_setup):
    """
    Test choosing a plan unlocks user active state.
    """
    # 1. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testowner@example.com", "password": "securepassword123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Select plan
    response = client.post(
        "/api/v1/billing/subscribe",
        json={"plan": "Starter"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["plan"] == "Starter"
    assert data["status"] == "Active"
    assert data["monthly_minutes_limit"] == 200
    
    # 3. Check me details (is_active should now be True)
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.json()["is_active"] is True


def test_active_user_can_access_crm(test_setup):
    """
    Test active user can interact with CRM customer list.
    """
    # 1. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testowner@example.com", "password": "securepassword123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Add Customer
    add_resp = client.post(
        "/api/v1/customers/",
        json={"name": "Kalyan Kumar", "phone": "+919999988888", "preferred_language": "Telugu"},
        headers=headers
    )
    assert add_resp.status_code == 201
    assert add_resp.json()["name"] == "Kalyan Kumar"
    
    # 3. List CRM contacts
    list_resp = client.get("/api/v1/customers/", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1


def test_business_settings_endpoint(test_setup):
    """
    Test that active users can fetch and update their business settings.
    """
    # 1. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testowner@example.com", "password": "securepassword123"}
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get current business settings
    get_resp = client.get("/api/v1/auth/business", headers=headers)
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert data["name"] == "Test Salon Shop"
    assert data["type"] == "Salon"
    assert data["timings_open"] == "09:00"
    assert data["timings_close"] == "20:00"

    # 3. Update business settings
    put_resp = client.put(
        "/api/v1/auth/business",
        json={
            "name": "Updated Salon Shop Name",
            "type": "Salon",
            "timings_open": "08:00",
            "timings_close": "22:00"
        },
        headers=headers
    )
    assert put_resp.status_code == 200
    updated_data = put_resp.json()
    assert updated_data["name"] == "Updated Salon Shop Name"
    assert updated_data["timings_open"] == "08:00"
    assert updated_data["timings_close"] == "22:00"

    # 4. Verify fetch returns updated settings
    verify_resp = client.get("/api/v1/auth/business", headers=headers)
    assert verify_resp.status_code == 200
    assert verify_resp.json()["name"] == "Updated Salon Shop Name"
