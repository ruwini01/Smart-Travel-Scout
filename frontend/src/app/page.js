"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import INVENTORY from "../../data/inventory.js";
import matchInventory from "../../utils/matchInventory.js";

import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import TrustStrip from "../../components/TrustStrip";
import ResultsSection from "../../components/ResultsSection";
import HowItWorks from "../../components/HowItWorks";
import AboutSection from "../../components/AboutSection";
import Footer from "../../components/Footer";
import ContactModal from "../../components/ContactModal";
import WishlistDrawer from "../../components/WishlistDrawer";
import BookingModal from "../../components/BookingModal";
import Toast from "../../components/Toast";

export default function Home() {
  //Search state
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  //Filter state
  const [activePrice, setActivePrice] = useState(null);
  const [activeTags, setActiveTags] = useState([]);

  //UI state
  const [wishlist, setWishlist] = useState([]);
  const [modal, setModal] = useState(null); //contact|wishlist|booking: item
  const [toast, setToast] = useState(null); //msg, icon

  //Section refs for scroll navigation
  const heroRef = useRef(null);
  const resultsRef = useRef(null);
  const howRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollTo = (key) => {
    const map = { results: resultsRef, howItWorks: howRef, about: aboutRef };
    map[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  //Recompute displayed results when filters change
  useEffect(() => {
    let filtered = [...allResults];
    if (activePrice) {
      filtered = filtered.filter(i => i.price <= parseInt(activePrice));
    }
    if (activeTags.length > 0) {
      filtered = filtered.filter(i => i.tags.some(t => activeTags.includes(t)));
    }
    setDisplayed(filtered);
  }, [activePrice, activeTags, allResults]);

  //Main search handler
  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setActivePrice(null);
    setActiveTags([]);

    try {
      //Call our API route → OpenAI → Zod validated results
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setAllResults(data.results);
      setDisplayed(data.results);

    } catch (err) {
      console.error("Search failed, falling back to local matcher:", err);

      //Fallback: use local keyword scorer if API fails
      const fallback = matchInventory(q, INVENTORY);
      setAllResults(fallback);
      setDisplayed(fallback);

      setToast({ msg: "Using offline matching — API unavailable", icon: "⚠️" });
    } finally {
      setIsLoading(false);
      // Scroll to results after search
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, []);

  //Wishlist toggle
  const handleWishlist = useCallback((id) => {
    setWishlist(prev => {
      const isLiked = prev.includes(id);
      const next = isLiked ? prev.filter(x => x !== id) : [...prev, id];
      const item = INVENTORY.find(i => i.id === id);
      setToast(
        isLiked
          ? { msg: "Removed from wishlist", icon: "🗑️" }
          : { msg: `${item?.title} saved to wishlist`, icon: "❤️" }
      );
      return next;
    });
  }, []);

  return (
    <>
      {/*Top teal strip*/}
      <div style={{
        background: "#007B82", padding: "7px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <span style={{ color: "#fff", fontSize: 13 }}>
          🌍 &nbsp;Real and remarkable small group trips — Sri Lanka curated experiences
        </span>
        <button
          onClick={() => setModal("contact")}
          style={{
            color: "#fff", fontSize: 13, fontWeight: 700,
            background: "rgba(255,255,255,.15)", borderRadius: 50,
            padding: "3px 12px", cursor: "pointer", border: "none",
            display: "flex", alignItems: "center", gap: 5, transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.15)"}
        >
          📞 Contact Us
        </button>
      </div>

      {/*Navbar*/}
      <Navbar
        wishlistCount={wishlist.length}
        onWishlist={() => setModal("wishlist")}
        onContact={() => setModal("contact")}
        scrollTo={scrollTo}
      />

      {/*Hero*/}
      <div ref={heroRef}>
        <HeroSection
          query={query} setQuery={setQuery}
          onSearch={handleSearch} isLoading={isLoading}
          resultsRef={resultsRef}
        />
      </div>

      {/*Trust strip*/}
      <TrustStrip />

      {/*Results*/}
      <ResultsSection
        hasSearched={hasSearched} isLoading={isLoading}
        allResults={allResults} displayed={displayed}
        activePrice={activePrice} setActivePrice={setActivePrice}
        activeTags={activeTags} setActiveTags={setActiveTags}
        onReset={() => { setActivePrice(null); setActiveTags([]); }}
        onView={item => setModal({ booking: item })}
        wishlist={wishlist} onWishlist={handleWishlist}
        onExampleSearch={() => {
          setQuery("wildlife safari photography");
          handleSearch("wildlife safari photography");
        }}
        resultsRef={resultsRef}
      />

      {/*How it works*/}
      <div ref={howRef}>
        <HowItWorks
          scrollToHero={() => heroRef.current?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>

      {/*About*/}
      <div ref={aboutRef}>
        <AboutSection />
      </div>

      {/*Footer*/}
      <Footer
        onContact={() => setModal("contact")}
        scrollTo={scrollTo}
      />

      {/*Modals*/}
      {modal === "contact" && (
        <ContactModal onClose={() => setModal(null)} />
      )}

      {modal === "wishlist" && (
        <WishlistDrawer
          items={INVENTORY}
          wishlist={wishlist}
          onClose={() => setModal(null)}
          onRemove={handleWishlist}
          onView={item => setModal({ booking: item })}
        />
      )}

      {modal?.booking && (
        <BookingModal
          item={modal.booking}
          onClose={() => setModal(null)}
          onBooked={() => setToast({ msg: "Booking confirmed! 🎉", icon: "🎫" })}
        />
      )}

      {/*Toast notifications*/}
      {toast && (
        <Toast
          message={toast.msg}
          icon={toast.icon}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}