import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { AboutPage } from './pages/AboutPage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { AdminAudioPage } from './pages/admin/AdminAudioPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminDashboardLayout } from './pages/admin/AdminDashboardLayout';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminPagesPage } from './pages/admin/AdminPagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AudioLibraryPage } from './pages/AudioLibraryPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { ContactPage } from './pages/ContactPage';
import { CustomPageDetail } from './pages/CustomPageDetail';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AudioPlayerBar />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/gallery"
              element={
                <PublicLayout>
                  <GalleryPage />
                </PublicLayout>
              }
            />
            <Route
              path="/audio"
              element={
                <PublicLayout>
                  <AudioLibraryPage />
                </PublicLayout>
              }
            />
            <Route
              path="/blog"
              element={
                <PublicLayout>
                  <BlogPage />
                </PublicLayout>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <PublicLayout>
                  <BlogPostDetail />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />
            <Route
              path="/page/:slug"
              element={
                <PublicLayout>
                  <CustomPageDetail />
                </PublicLayout>
              }
            />

            {/* ADMIN LOGIN */}
            <Route
              path="/admin/login"
              element={
                <PublicLayout>
                  <AdminLoginPage />
                </PublicLayout>
              }
            />

            {/* SECURE ADMIN DASHBOARD LAYOUT */}
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="dashboard" element={<AdminOverviewPage />} />
              <Route path="about" element={<AdminAboutPage />} />
              <Route path="pages" element={<AdminPagesPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="audio" element={<AdminAudioPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* CATCH ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AudioProvider>
    </AuthProvider>
  );
}
