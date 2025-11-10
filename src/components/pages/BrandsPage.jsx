import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const BrandsPage = () => {
  const navigate = useNavigate();
const [brands, setBrands] = useState([]);
  const [brandProducts, setBrandProducts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all products and extract unique brands with product counts
      const products = await productService.getAll();
      const brandMap = {};
      
setAllProducts(products);
      
      // Group products by brand for later use
      const productsByBrand = {};
      
      products.forEach(product => {
        if (!brandMap[product.brand]) {
          brandMap[product.brand] = {
            name: product.brand,
            productCount: 0,
            products: []
          };
        }
        brandMap[product.brand].productCount += 1;
        brandMap[product.brand].products.push(product);
        
        // Also group for productsByBrand state
        if (!productsByBrand[product.brand]) {
          productsByBrand[product.brand] = [];
        }
        productsByBrand[product.brand].push(product);
      });
      
      setBrandProducts(productsByBrand);
      
      const brandsArray = Object.values(brandMap).sort((a, b) => 
        b.productCount - a.productCount
      );
      
      setBrands(brandsArray);
    } catch (err) {
      setError('Failed to load brands');
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

// Filter products based on search term
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group filtered products by brand
  const filteredBrandProducts = {};
  filteredProducts.forEach(product => {
    if (!filteredBrandProducts[product.brand]) {
      filteredBrandProducts[product.brand] = [];
    }
    filteredBrandProducts[product.brand].push(product);
  });

const displayBrandProducts = searchTerm ? filteredBrandProducts : brandProducts;

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadBrands} />;
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Brands
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-body max-w-2xl mx-auto mb-8"
          >
            Explore products from your favorite beauty brands
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brands Grid */}
        <section className="mb-16">
          {filteredBrands.length === 0 ? (
            <Empty
              title={searchTerm ? "No Brands Found" : "No Brands Available"}
              message={searchTerm ? `No brands match "${searchTerm}"` : "We're working on adding more brands. Check back soon!"}
            />
          ) : (
<div className="space-y-12">
              {filteredBrands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                      <span className="font-display text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                      {brand.name}
                    </h3>
                    <p className="text-gray-500 font-body text-sm mb-4">
                      {brand.productCount} product{brand.productCount !== 1 ? 's' : ''}
                    </p>
                    <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">
                        {displayBrandProducts[brand.name]?.length || 0} Product{(displayBrandProducts[brand.name]?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  {/* Products for this brand */}
                  {displayBrandProducts[brand.name] && displayBrandProducts[brand.name].length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <ProductGrid 
                        products={displayBrandProducts[brand.name]}
                        title={`${brand.name} Products`}
                        className="mb-8"
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

{/* Search Results Summary */}
        {searchTerm && (
          <div className="mb-8 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
            <p className="text-gray-700 font-medium">
              {filteredProducts.length > 0 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                : `No products found matching "${searchTerm}"`
              }
            </p>
          </div>
        )}

        {/* Brand Statistics */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Our Brand Portfolio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  {brands.length}+
                </div>
                <p className="text-gray-600 font-body">Premium Brands</p>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  {brands.reduce((sum, brand) => sum + brand.productCount, 0)}+
                </div>
                <p className="text-gray-600 font-body">Quality Products</p>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  100%
                </div>
                <p className="text-gray-600 font-body">Authentic Products</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandsPage;