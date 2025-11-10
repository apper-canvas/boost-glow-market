import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
            <ApperIcon name="Search" className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="font-display text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 font-body mb-8 text-lg">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          
          <div className="space-y-4">
            <Button size="lg" onClick={() => navigate("/")}>
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            
            <div className="flex justify-center">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-body mb-4">
              Need help finding something?
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate("/search")}>
                Search Products
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                Browse Categories
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;