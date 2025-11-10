import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ProductGrid from '@/components/organisms/ProductGrid';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import collectionService from '@/services/api/collectionService';
import productService from '@/services/api/productService';

const CollectionsPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await collectionService.getAll();
      setCollections(data);
      setFeaturedCollections(data.filter(collection => collection.featured));
    } catch (err) {
      setError('Failed to load collections');
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

const handleCollectionSelect = async (collection) => {
    try {
      setProductsLoading(true);
      setSelectedCollection(collection);
      
      const products = await collectionService.getCollectionProducts(collection.Id);
      setCollectionProducts(products);
      
      // Scroll to products section
      document.getElementById('collection-products')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } catch (err) {
      toast.error('Failed to load collection products');
      setCollectionProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedCollection(null);
    setCollectionProducts([]);
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCollections} />;
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
            Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-body max-w-2xl mx-auto"
          >
            Discover our curated beauty collections crafted by experts
          </motion.p>
        </div>

        {/* Featured Collections */}
        {featuredCollections.length > 0 && (
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Featured Collections
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredCollections.map((collection, index) => (
                <motion.div
                  key={collection.Id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group cursor-pointer ${
                    selectedCollection?.Id === collection.Id
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  onClick={() => handleCollectionSelect(collection)}
                >
                  <div className="bg-surface rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                        {collection.name}
                      </h3>
                      <p className="text-gray-600 font-body text-sm mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-body">
                          {collection.productIds.length} products
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                        >
                          View Collection
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Collections */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            All Collections
          </motion.h2>
          
          {collections.length === 0 ? (
            <Empty
              title="No Collections Found"
              message="We're working on adding more collections. Check back soon!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.Id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`group cursor-pointer ${
                    selectedCollection?.Id === collection.Id
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  onClick={() => handleCollectionSelect(collection)}
                >
                  <div className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200">
                        {collection.name}
                      </h3>
                      <p className="text-gray-500 font-body text-xs mb-2">
                        {collection.productIds.length} products
                      </p>
                      {collection.featured && (
                        <span className="inline-block bg-primary/10 text-primary text-xs font-body font-medium px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Selected Collection Products */}
        {selectedCollection && (
          <section id="collection-products" className="mb-16">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {selectedCollection.name}
                  </h3>
                  <p className="text-gray-600 font-body text-lg max-w-2xl">
                    {selectedCollection.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  className="shrink-0"
                >
                  Clear Selection
                </Button>
              </div>
            </div>

            {productsLoading ? (
              <Loading type="grid" />
            ) : collectionProducts.length === 0 ? (
              <Empty
                title="No Products Found"
                message="This collection doesn't have any products yet."
              />
            ) : (
              <ProductGrid 
                products={collectionProducts}
                title={`${selectedCollection.name} Products`}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;