const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('\n=== Testing Product Endpoints ===\n');

  try {
    // Test 1: Get products for pets
    console.log('1. Testing getPetProducts (should only return approved products)...');
    try {
      const response = await axios.get(`${BASE_URL}/product/get?parent=cat&category=food&count=0`);
      console.log(`   ✓ Status: ${response.status}`);
      console.log(`   ✓ Products returned: ${response.data.products?.length || 0}`);
      console.log(`   ✓ Total products: ${response.data.totalProducts || 0}`);
      
      // Check if all products have status: true
      const allApproved = response.data.products?.every(p => p.status === true);
      console.log(`   ${allApproved ? '✓' : '✗'} All products approved: ${allApproved}`);
    } catch (error) {
      console.log(`   ✗ Error: ${error.message}`);
    }

    // Test 2: Search products
    console.log('\n2. Testing searchProducts (should only return approved products)...');
    try {
      const response = await axios.get(`${BASE_URL}/product/search?query=cat`);
      console.log(`   ✓ Status: ${response.status}`);
      console.log(`   ✓ Products returned: ${response.data.products?.length || 0}`);
      
      // Check if all products have status: true
      const allApproved = response.data.products?.every(p => p.status === true);
      console.log(`   ${allApproved ? '✓' : '✗'} All products approved: ${allApproved}`);
    } catch (error) {
      console.log(`   ✗ Error: ${error.message}`);
    }

    // Test 3: Get featured products
    console.log('\n3. Testing getProducts with type=featured (should only return approved products)...');
    try {
      const response = await axios.get(`${BASE_URL}/product/featured/all`);
      console.log(`   ✓ Status: ${response.status}`);
      console.log(`   ✓ Products returned: ${response.data.products?.length || 0}`);
      
      // Check if all products have status: true
      const allApproved = response.data.products?.every(p => p.status === true);
      console.log(`   ${allApproved ? '✓' : '✗'} All products approved: ${allApproved}`);
    } catch (error) {
      console.log(`   ✗ Error: ${error.message}`);
    }

    console.log('\n=== Tests Complete ===\n');

  } catch (error) {
    console.error('Test suite error:', error.message);
  }
}

testEndpoints();
