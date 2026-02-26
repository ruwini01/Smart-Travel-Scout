"use client";
import ExperienceCard from "./ExperienceCard";
import FilterBar from "./FilterBar";
import SkeletonCard from "./SkeletonCard";

export default function ResultsSection({
  hasSearched, isLoading,
  allResults, displayed,
  activePrice, setActivePrice,
  activeTags, setActiveTags,
  onReset, onView,
  wishlist, onWishlist,
  onExampleSearch, resultsRef,
}) {
  // Don't render anything until user has searched
  if (!hasSearched && !isLoading) return null;

  return (
    <div ref={resultsRef} style={{ background:"#fafafa", minHeight:200 }}>

      {/* Results header */}
      {hasSearched && !isLoading && (
        <div style={{
          padding:"28px 24px 0",
          display:"flex", justifyContent:"space-between",
          alignItems:"center", flexWrap:"wrap", gap:8,
        }}>
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:"#1a1a1a" }}>
              {displayed.length} experience{displayed.length !== 1 ? "s" : ""}{" "}
              match{displayed.length === 1 ? "es" : ""} your search
            </h2>
            <p style={{ fontSize:13, color:"#888", marginTop:2 }}>
              Sorted by relevance · Only from verified Sri Lanka inventory
            </p>
          </div>

          {/* Grounded badge */}
          <span style={{
            background:"#f0fdf4", color:"#16a34a",
            borderRadius:50, padding:"4px 14px",
            fontSize:12, fontWeight:700,
            border:"1px solid #bbf7d0",
          }}>
            ✓ AI-grounded results only
          </span>
        </div>
      )}

      {/* Filter bar — only show when there are results */}
      {hasSearched && !isLoading && allResults.length > 0 && (
        <div style={{ marginTop:16 }}>
          <FilterBar
            activePrice={activePrice} setActivePrice={setActivePrice}
            activeTags={activeTags}   setActiveTags={setActiveTags}
            onReset={onReset}
          />
        </div>
      )}

      {/* Cards area */}
      <div style={{ padding:"24px 24px 52px" }}>
        {/* Loading skeletons */}
        {isLoading && (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
            gap:24,
          }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* No results */}
        {!isLoading && displayed.length === 0 && (
          <div style={{ textAlign:"center", padding:"64px 16px" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🗺️</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#1a1a1a", marginBottom:8 }}>
              No Matches Found
            </h3>
            <p style={{
              color:"#555", fontSize:15, marginBottom:24,
              maxWidth:360, margin:"0 auto 24px",
            }}>
              Try different keywords or relax your budget.
              We have 5 amazing Sri Lanka experiences.
            </p>
            <button
              className="btn-red"
              onClick={onExampleSearch}
              style={{ padding:"11px 28px", fontSize:15 }}
            >
              Try an example search →
            </button>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && displayed.length > 0 && (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
            gap:24,
          }}>
            {displayed.map(item => (
              <ExperienceCard
                key={item.id}
                item={item}
                onView={onView}
                wishlist={wishlist}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}