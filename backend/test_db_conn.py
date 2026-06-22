import psycopg2
import sys
import urllib.parse
import socket

password = urllib.parse.quote_plus("AiVoice@50cr")
db_name = "postgres"
port_pooler = 6543

regions = [
    "ap-south-1",      # Mumbai
    "ap-southeast-1",  # Singapore
    "ap-southeast-2",  # Sydney
    "ap-northeast-1",  # Tokyo
    "ap-northeast-2",  # Seoul
    "ap-northeast-3",  # Osaka
    "us-east-1",       # N. Virginia
    "us-east-2",       # Ohio
    "us-west-1",       # N. California
    "us-west-2",       # Oregon
    "eu-west-1",       # Ireland
    "eu-west-2",       # London
    "eu-west-3",       # Paris
    "eu-central-1",    # Frankfurt
    "eu-central-2",    # Zurich
    "ca-central-1",    # Canada Central
    "sa-east-1"        # Sao Paulo
]

project_refs = [
    "weepofljegmwftrbpxlm",  # with 'g'
    "weepofljeqmwftrbpxlm"   # with 'q'
]

print("Starting global region database connectivity scan...\n")

working_dsn = None

for region in regions:
    pooler_host = f"aws-0-{region}.pooler.supabase.com"
    
    # Check if pooler DNS resolves
    try:
        socket.gethostbyname(pooler_host)
    except socket.gaierror:
        print(f"Skipping region {region} (DNS host not found)")
        continue

    for ref in project_refs:
        username = f"postgres.{ref}"
        dsn = f"postgresql://{username}:{password}@{pooler_host}:{port_pooler}/{db_name}"
        
        print(f"Testing Region: {region} | Project ID: {ref}...")
        try:
            # We use a short timeout so the scan is fast
            conn = psycopg2.connect(dsn, connect_timeout=2)
            conn.close()
            print(f"--> SUCCESS! Connected successfully to {region} using {ref}!\n")
            working_dsn = dsn
            break
        except Exception as e:
            err_msg = str(e).strip()
            # If the error is password authentication failed, the tenant was found, but the password was wrong.
            # That still means the tenant ID and region are 100% correct!
            if "password authentication failed" in err_msg:
                print(f"--> SUCCESS (Tenant Found)! Password was incorrect, but the region and tenant ID are correct.\n")
                working_dsn = dsn
                break
            else:
                print(f"--> Failed: {err_msg}")
    
    if working_dsn:
        break

if working_dsn:
    print("="*60)
    print("FOUND WORKING CONFIGURATION:")
    print(working_dsn)
    print("="*60)
    sys.exit(0)
else:
    print("All global regions and project ID combinations failed. Please check your Supabase project status.")
    sys.exit(1)
