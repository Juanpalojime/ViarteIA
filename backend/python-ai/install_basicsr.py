import sys
import subprocess

def install_package(package):
    print(f"Installing {package}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    install_package("numpy<2.0.0")
    install_package("setuptools")
    install_package("wheel")
    # basicsr needs to be installed AFTER numpy and setuptools
    # We use --no-build-isolation to use the numpy we just installed
    subprocess.check_call([sys.executable, "-m", "pip", "install", "basicsr", "--no-build-isolation"])
    print("Successfully installed basicsr")
except Exception as e:
    print(f"Failed to install basicsr: {e}")
    # Fallback: install without dependencies and hope for the best
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "basicsr", "--no-deps"])
        print("Installed basicsr with --no-deps fallback")
    except Exception as e2:
        print(f"Fallback also failed: {e2}")
