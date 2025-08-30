#!/usr/bin/env python3
"""
Script to help connect your Next.js frontend to this FastAPI backend.
"""

import requests
import json

# Backend URL
BACKEND_URL = "http://localhost:8000"

def test_backend_connection():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print("✅ Backend is running!")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running. Start it with: python main.py")
        return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False

def test_rule_parsing():
    """Test rule parsing with OpenAI"""
    try:
        test_rule = "Create a revenue sharing rule with 25% rate and 85% traffic quality threshold"
        
        response = requests.post(
            f"{BACKEND_URL}/parse-rule",
            json={"rule_description": test_rule}
        )
        
        if response.status_code == 200:
            print("✅ Rule parsing works!")
            print(f"Parsed rule: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Rule parsing failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error testing rule parsing: {e}")

def test_chat():
    """Test AI chat functionality"""
    try:
        test_message = "How do I create a performance-based rule?"
        
        response = requests.post(
            f"{BACKEND_URL}/chat",
            json={"message": test_message}
        )
        
        if response.status_code == 200:
            print("✅ AI chat works!")
            print(f"AI Response: {response.json()['response']}")
        else:
            print(f"❌ AI chat failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error testing AI chat: {e}")

def main():
    print("🚀 Testing PAM AI Rule Engine Backend")
    print("=" * 50)
    
    # Test backend connection
    if not test_backend_connection():
        return
    
    print("\n" + "=" * 50)
    
    # Test rule parsing
    print("\n🧪 Testing Rule Parsing...")
    test_rule_parsing()
    
    print("\n" + "=" * 50)
    
    # Test AI chat
    print("\n💬 Testing AI Chat...")
    test_chat()
    
    print("\n" + "=" * 50)
    print("🎉 Backend testing complete!")
    print("\nNext steps:")
    print("1. Update your frontend to call these API endpoints")
    print("2. Replace mock data with real API calls")
    print("3. Test with your actual PDF contracts")

if __name__ == "__main__":
    main()
