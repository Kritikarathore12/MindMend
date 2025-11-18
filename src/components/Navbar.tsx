import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

/**
 * Navbar Component
 * Sticky navigation bar with smooth scroll links, mobile menu, and auth controls
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Test", href: "#test" },
    { name: "Journal", href: "#journal" },
    { name: "Activities", href: "#activities" },
    { name: "Chat", href: "#chat" },
    { name: "Insights", href: "#insights" },
    { name: "Support", href: "#support" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-nav backdrop-blur-sm border-b border-white/20 shadow-glow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="MindMend Logo" className="h-10 w-10 drop-shadow-lg" />
            <span className="text-xl font-semibold text-white drop-shadow-md">MindMend</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                onClick={() => scrollToSection(link.href)}
                className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 font-medium"
              >
                {link.name}
              </Button>
            ))}
            
            {/* Auth Button */}
            <Button
              onClick={handleAuthAction}
              variant={user ? "outline" : "default"}
              className={user ? "ml-2 border-white/30 text-white bg-transparent hover:bg-white/20" : "ml-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"}
            >
              {user ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-white hover:bg-white/20"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gradient-ocean/95 backdrop-blur-md border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                onClick={() => scrollToSection(link.href)}
                className="w-full text-left justify-start text-white hover:bg-white/20"
              >
                {link.name}
              </Button>
            ))}
            
            {/* Mobile Auth Button */}
            <Button
              onClick={handleAuthAction}
              variant={user ? "outline" : "default"}
              className={`w-full ${user ? "border-white/30 text-white bg-transparent hover:bg-white/20" : "bg-white/20 hover:bg-white/30 text-white border border-white/30"}`}
            >
              {user ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
