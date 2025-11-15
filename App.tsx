import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import CategoryGrid from './components/CategoryGrid.tsx';
import ProductSection from './components/ProductSection.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import WhyChooseUs from './components/WhyChooseUs.tsx';
import NewProducts from './components/NewProducts.tsx';
import AppPromotion from './components/AppPromotion.tsx';
import Footer from './components/Footer.tsx';
import ProductsPage from './components/ProductsPage.tsx';
import ProductDetailPage from './components/ProductDetailPage.tsx';
import AuthPage from './components/AuthPage.tsx';
import StaticPage from './components/StaticPage.tsx';
import AdminPage from './components/admin/AdminPage.tsx';
import { useAppContext } from './state/AppContext.tsx';

const HomePage: React.FC = () => {
  const { state, navigateTo } = useAppContext();
  const { homepage_sections, categories, loading } = state;

  if (loading && homepage_sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-500" role="status" aria-label="Loading..."></div>
      </div>
    );
  }

  return (
    <>
      <Hero onShopNow={() => navigateTo('products')} />
      <div className="bg-transparent">
        <div className="relative">
          <div className="absolute inset-0 bg-grid-slate-700/40 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)]"></div>
          {homepage_sections.filter(s => s.visible).map(section => {
              switch(section.type) {
                  case 'category_grid':
                      return <CategoryGrid key={section.id} title={section.title} subtitle={section.subtitle} />;
                  case 'new_products':
                      return <NewProducts key={section.id} title={section.title} subtitle={section.subtitle} onViewAll={() => navigateTo('products')} onCardClick={(id) => navigateTo('product_detail', id)} />;
                  case 'product_section':
                      if (!section.category_id) return null;
                      return <ProductSection key={section.id} title={section.title} subtitle={section.subtitle} categoryId={section.category_id} onViewAll={() => navigateTo('category', section.category_id)} onCardClick={(id) => navigateTo('product_detail', id)} />;
                  default:
                      return null;
              }
          })}
        </div>
      </div>
      <div className="bg-transparent">
        <HowItWorks />
        <WhyChooseUs />
        <AppPromotion />
      </div>
    </>
  );
};

const App: React.FC = () => {
  const { state } = useAppContext();
  const { current_page, current_category_id, current_user } = state;

  const renderPage = () => {
    switch (current_page) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'category':
        return <ProductsPage categoryId={current_category_id} />;
      case 'product_detail':
        return <ProductDetailPage />;
      case 'auth':
        return <AuthPage />;
      case 'my_account':
        return <StaticPage pageKey="my_account" />;
      case 'admin':
        if (current_user?.role === 'owner' || current_user?.role === 'moderator') {
          return <AdminPage />;
        }
        return <HomePage />; // Redirect home if not admin
      case 'terms':
      case 'privacy':
      case 'refund':
      case 'faq':
      case 'about':
      case 'contact':
      case 'blog':
      case 'business':
        return <StaticPage pageKey={current_page} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="text-white font-sans">
      <Header />
      <main>
        {renderPage()}
      </main>
      <Footer />
      {/* Fly to cart animation target */}
      <div id="flying-cart-item" className="fixed top-0 left-0 bg-slate-700 rounded-full z-[100] pointer-events-none opacity-0" />
    </div>
  );
};

export default App;