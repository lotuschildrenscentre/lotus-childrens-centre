import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import GetInvolved from "./pages/GetInvolved";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminContent from "./pages/admin/AdminContent";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminFormBuilder from "./pages/admin/AdminFormBuilder";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/submissions" component={AdminSubmissions} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/content" component={AdminContent} />
        <Route path="/admin/blog" component={AdminBlogPosts} />
        <Route path="/admin/form-builder" component={AdminFormBuilder} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();

  // Admin routes use their own layout
  if (location.startsWith("/admin")) {
    return <AdminRoutes />;
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/get-involved"} component={GetInvolved} />
      <Route path={"/login"} component={Login} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <ScrollToTop />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
