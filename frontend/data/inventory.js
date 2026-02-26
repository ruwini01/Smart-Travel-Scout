const INVENTORY = [
    {
        id: 1,
        title: "High-Altitude Tea Trails",
        location: "Nuwara Eliya",
        country: "Sri Lanka",
        price: 120,
        duration: "3 days",
        groupSize: "Max 12",
        rating: 4.9,
        reviews: 134,
        tags: ["cold", "nature", "hiking"],
        description:
            "Trek through misty highland tea estates with panoramic mountain views, local tea tastings and overnight stays at a colonial-era plantation bungalow.",
        longDescription:
            "Begin your journey in the cool misty highlands of Nuwara Eliya, Sri Lanka's tea country. Your expert local guide will lead you through endless rows of perfectly manicured tea bushes, sharing the history and science behind world-famous Ceylon tea. You'll visit a working tea factory, learn the full picking-to-cup process, and enjoy fresh brews at 2,000m altitude with breathtaking valley views.",
        image:
            "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1567892320421-3c7a9e3a12fb?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80&auto=format&fit=crop",
        ],
        highlights: ["Expert local guide", "Tea factory tour", "Colonial bungalow stay", "Panoramic viewpoints"],
        includes: ["Accommodation", "All meals", "Guide fees", "Transport"],
    },
    {
        id: 2,
        title: "Coastal Heritage Wander",
        location: "Galle Fort",
        country: "Sri Lanka",
        price: 45,
        duration: "1 day",
        groupSize: "Max 16",
        rating: 4.7,
        reviews: 212,
        tags: ["history", "culture", "walking"],
        description:
            "Explore centuries-old Dutch colonial streets, ocean-facing ramparts, boutique galleries, and hidden cafés tucked behind ancient walls.",
        longDescription:
            "Galle Fort is one of the best-preserved colonial sea forts in Asia, a UNESCO World Heritage Site where 17th-century Dutch architecture meets Sri Lankan street life. Your knowledgeable guide navigates the labyrinthine lanes, pointing out former VOC warehouses, a functioning lighthouse, mosques, churches, and temples all within metres of each other.",
        image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1566559532215-c9f7f4f56d54?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551882547-ff40c4fe799f?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80&auto=format&fit=crop",
        ],
        highlights: ["UNESCO World Heritage site", "Dutch-colonial architecture", "Ocean rampart sunset", "Local food tasting"],
        includes: ["Expert guide", "Street food tasting", "Entry fees", "Map & booklet"],
    },
    {
        id: 3,
        title: "Wild Safari Expedition",
        location: "Yala National Park",
        country: "Sri Lanka",
        price: 250,
        duration: "2 days",
        groupSize: "Max 8",
        rating: 4.8,
        reviews: 89,
        tags: ["animals", "adventure", "photography"],
        description:
            "Track leopards and elephants through Sri Lanka's most iconic national park with expert trackers and professional photography guidance.",
        longDescription:
            "Yala is home to the highest concentration of leopards on Earth. Your specialist tracker reads the landscape with decades of experience, positioning your jeep perfectly for photography at golden hour. Elephants, sloth bears, crocodiles, peacocks and hundreds of bird species complete a spectacular wildlife spectacle.",
        image:
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551655510-555dc3be8633?w=600&q=80&auto=format&fit=crop",
        ],
        highlights: ["Expert wildlife tracker", "Leopard territory access", "Photography coaching", "Sunrise & sunset drives"],
        includes: ["Safari camp accommodation", "All meals", "Park fees", "Photography guide", "4WD jeep"],
    },
    {
        id: 4,
        title: "Surf & Chill Retreat",
        location: "Arugam Bay",
        country: "Sri Lanka",
        price: 80,
        duration: "4 days",
        groupSize: "Max 10",
        rating: 4.6,
        reviews: 178,
        tags: ["beach", "surfing", "young-vibe"],
        description:
            "Ride world-class waves by day, unwind at beach shacks by night. Suitable for beginners and intermediates with daily surf coaching included.",
        longDescription:
            "Arugam Bay consistently ranks among Asia's top surf destinations. This 4-day retreat balances daily coached surf sessions with plenty of unstructured time to explore the beach, snorkel coral gardens, or simply hammock-hang between coconut palms. Evenings belong to the legendary beachfront shack scene.",
        image:
            "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1510622060402-2b0c5bfa2399?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop",
        ],
        highlights: ["Daily surf coaching", "Board & wetsuit included", "Beachfront accommodation", "Snorkel excursion"],
        includes: ["3 nights accommodation", "Breakfast daily", "Surf equipment", "Coaching sessions"],
    },
    {
        id: 5,
        title: "Ancient City Exploration",
        location: "Sigiriya",
        country: "Sri Lanka",
        price: 110,
        duration: "2 days",
        groupSize: "Max 14",
        rating: 4.9,
        reviews: 203,
        tags: ["history", "climbing", "view"],
        description:
            "Climb the legendary 200m Lion Rock fortress rising from jungle plains, explore 5th-century frescoes and discover the surrounding ancient cities.",
        longDescription:
            "Rising 200 metres above the surrounding jungle, Sigiriya — Lion Rock — is Sri Lanka's most dramatic landmark. Your archaeologist guide unravels the story of King Kashyapa who built his palace fortress here in the 5th century AD. You'll pass the famous frescoes, walk the Mirror Wall, and climb through the Lion's Paw gateway to a summit with 360° views.",
        image:
            "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=80&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1583087253560-26c98a8bed97?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80&auto=format&fit=crop",
        ],
        highlights: ["Archaeologist guide", "Sigiriya frescoes access", "Summit 360° views", "Polonnaruwa day trip"],
        includes: ["1 night hotel", "All entry fees", "Expert guide", "Breakfast"],
    },
];

export default INVENTORY;