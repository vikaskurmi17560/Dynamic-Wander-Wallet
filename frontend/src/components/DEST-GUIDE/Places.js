const Destination = [
    {
        name: "Taj Mahal",
        location: "Agra, Uttar Pradesh",
        type: "Historical Monument",
        description:
            "A UNESCO World Heritage Site and one of the Seven Wonders of the World, the Taj Mahal is an ivory-white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
        link: "https://www.tajmahal.gov.in/",
        image: "https://source.unsplash.com/600x400/?taj-mahal",
    },
    {
        name: "Jaipur",
        location: "Rajasthan",
        type: "Cultural & Heritage",
        description:
            "Known as the 'Pink City', Jaipur is famous for its royal palaces, forts, and vibrant culture. Key attractions include the Amber Fort, Hawa Mahal, and City Palace.",
        link: "https://www.tourism.rajasthan.gov.in/jaipur.html",
        image: "https://source.unsplash.com/600x400/?jaipur",
    },
    {
        name: "Leh-Ladakh",
        location: "Jammu & Kashmir",
        type: "Adventure & Scenic",
        description:
            "A high-altitude desert known for its breathtaking landscapes, Buddhist monasteries, and adventure biking routes.",
        link: "https://leh.nic.in/",
        image: "https://source.unsplash.com/600x400/?leh-ladakh",
    },
    {
        name: "Goa",
        location: "Goa",
        type: "Beaches & Nightlife",
        description:
            "Famous for its beautiful beaches, vibrant nightlife, Portuguese heritage, and water sports.",
        link: "https://www.goa-tourism.com/",
        image: "https://source.unsplash.com/600x400/?goa-beach",
    },
    {
        name: "Kerala Backwaters",
        location: "Kerala",
        type: "Nature & Relaxation",
        description:
            "A network of serene canals, lagoons, and lakes best explored via houseboats, offering a tranquil experience amidst lush greenery.",
        link: "https://www.keralatourism.org/backwaters/",
        image: "https://source.unsplash.com/600x400/?kerala-backwaters",
    },
    {
        name: "Manali",
        location: "Himachal Pradesh",
        type: "Mountains & Adventure",
        description:
            "A popular hill station surrounded by snow-capped mountains, ideal for trekking, paragliding, and river rafting.",
        link: "https://himachaltourism.gov.in/",
        image: "https://source.unsplash.com/600x400/?manali",
    },
    {
        name: "Varanasi",
        location: "Uttar Pradesh",
        type: "Spiritual & Cultural",
        description:
            "One of the world's oldest cities, Varanasi is renowned for its ghats along the Ganges River and spiritual significance.",
        link: "https://varanasi.nic.in/",
        image: "https://source.unsplash.com/600x400/?varanasi",
    },
    {
        name: "Rishikesh",
        location: "Uttarakhand",
        type: "Yoga & Adventure",
        description:
            "Known as the 'Yoga Capital of the World', Rishikesh offers spiritual retreats, white-water rafting, and scenic trekking trails.",
        link: "https://uttarakhandtourism.gov.in/",
        image: "https://source.unsplash.com/600x400/?rishikesh",
    },
    {
        name: "Andaman Islands",
        location: "Andaman & Nicobar Islands",
        type: "Beaches & Water Sports",
        description:
            "A tropical paradise with pristine beaches, vibrant coral reefs, and activities like snorkeling and scuba diving.",
        link: "https://www.andamantourism.gov.in/",
        image: "https://source.unsplash.com/600x400/?andaman-islands",
    },
    {
        name: "Darjeeling",
        location: "West Bengal",
        type: "Tea Gardens & Scenic Views",
        description:
            "Famous for its tea plantations, panoramic views of Mount Kanchenjunga, and the heritage toy train.",
        link: "https://wbtourism.gov.in/",
        image: "https://source.unsplash.com/600x400/?darjeeling",
    },
    {
        name: "Udaipur",
        location: "Rajasthan",
        type: "Lakes & Heritage",
        description:
            "Known as the 'City of Lakes', Udaipur is celebrated for its palaces, scenic lakes, and vibrant markets.",
        link: "https://www.tourism.rajasthan.gov.in/udaipur.html",
        image: "https://source.unsplash.com/600x400/?udaipur",
    },
    {
        name: "Coorg",
        location: "Karnataka",
        type: "Hill Station & Coffee Plantations",
        description:
            "A serene hill station known for its coffee plantations, lush greenery, and pleasant climate.",
        link: "https://www.karnatakatourism.org/",
        image: "https://source.unsplash.com/600x400/?coorg",
    },
    {
        name: "Shillong",
        location: "Meghalaya",
        type: "Natural Beauty & Culture",
        description:
            "Often called the 'Scotland of the East', Shillong is known for its waterfalls, caves, and vibrant music scene.",
        link: "https://megtourism.gov.in/",
        image: "https://source.unsplash.com/600x400/?shillong",
    },
    {
        name: "Hampi",
        location: "Karnataka",
        type: "Historical Ruins",
        description:
            "A UNESCO World Heritage Site, Hampi is famous for its ancient temples, ruins, and boulder-strewn landscapes.",
        link: "https://karnatakatourism.org/tour-item/hampi/",
        image: "https://source.unsplash.com/600x400/?hampi",
    },
    {
        name: "Ooty",
        location: "Tamil Nadu",
        type: "Hill Station & Gardens",
        description:
            "A popular hill station featuring botanical gardens, lakes, and a scenic toy train ride.",
        link: "https://www.tamilnadutourism.tn.gov.in/",
        image: "https://source.unsplash.com/600x400/?ooty",
    },
    {
        name: "Amritsar",
        location: "Punjab",
        type: "Spiritual & Cultural",
        description:
            "Home to the Golden Temple, Amritsar is a spiritual hub known for its hospitality and rich Sikh heritage.",
        link: "https://punjabtourism.punjab.gov.in/",
        image: "https://source.unsplash.com/600x400/?amritsar",
    },
    {
        name: "Kaziranga National Park",
        location: "Assam",
        type: "Wildlife Safari",
        description:
            "A UNESCO World Heritage Site, famous for its population of one-horned rhinoceroses and rich biodiversity.",
        link: "https://assamtourism.gov.in/",
        image: "https://source.unsplash.com/600x400/?kaziranga",
    },
    {
        name: "Auli",
        location: "Uttarakhand",
        type: "Skiing & Mountains",
        description:
            "A premier skiing destination surrounded by oak forests and offering stunning views of the Himalayas.",
        link: "https://uttarakhandtourism.gov.in/auli",
        image: "https://source.unsplash.com/600x400/?auli",
    },
];

export default Destination;
