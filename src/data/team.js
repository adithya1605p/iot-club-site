import deepak from '../assets/team/deepak.jpeg';
import abhinav from '../assets/team/abhinav.jpeg';
import shreeya from '../assets/team/shreeya.jpeg';
import padma from '../assets/team/padma_priya.jpeg';

export const team = [
    {
        id: 1,
        name: "A. Lakshmi Deepak",
        role: "President",
        bio: "Leading the club with a vision for innovation.",
        image: deepak,
        socials: { linkedin: "https://www.linkedin.com/in/deepak1010" }
    },
    {
        id: 2,
        name: "N. Abhinav",
        role: "Secretary",
        bio: "Managing documentation and club communications.",
        image: abhinav,
        socials: { linkedin: "https://www.linkedin.com/in/abhinav-nadipelly-504971322" }
    },
    {
        id: 3,
        name: "K. Shreeya",
        role: "HR",
        bio: "Handling recruitment and human resources.",
        image: shreeya,
        socials: { linkedin: "https://www.linkedin.com/in/shreeya-kommajosyula-93472828b" }
    },
    {
        id: 4,
        name: "K. Sai Padma Priya",
        role: "Treasurer",
        bio: "Managing club finances and budget allocation.",
        image: padma,
        socials: { linkedin: "https://www.linkedin.com/in/padmapriya-kopparthi-b22657353" }
    },
];

// Each batch = { batchLabel, year, members[] }
// To add a new batch, append another object to this array.
export const advisoryBatches = [
    {
        batchLabel: "Founding Batch",
        year: "2020–24",
        members: [
            {
                id: 'f1', name: "Sathvik Parasa", role: "President", isFounder: true,
                bio: "Founder of IoT Club GCET. Established the vision, built the core team, and led the first events.",
                image: "/team/founding/image5.png", objPos: '50% 17%',
                linkedin: 'https://www.linkedin.com/in/sathvik-parasa-236479207/',
            },
            {
                id: 'f2', name: "Kalyani Reddy", role: "Vice President",
                bio: "Co-led operations and ensured the president's decisions were carried out effectively.",
                image: "/team/founding/image4.png",
                linkedin: 'https://www.linkedin.com/in/manyam-kalyani-reddy-282975239/',
            },
            {
                id: 'f3', name: "Akash Arupali", role: "Secretary",
                bio: "Handled documentation, idea generation, and overall club coordination.",
                image: "/team/founding/image7.png",
                linkedin: 'https://www.linkedin.com/in/akash-arupali-762847206/',
            },
            {
                id: 'f4', name: "Charan", role: "Project Manager",
                bio: "Organised and drove innovative IoT project ideas for the founding batch.",
                image: "/team/founding/image6.png", objPos: '48% 59%',
                linkedin: 'https://www.linkedin.com/in/charan-kalyankar/',
            },
            {
                id: 'f5', name: "Abhilash", role: "Project Manager",
                bio: "Guided members through projects and hardware challenges.",
                image: "/team/founding/image9.png",
            },
            {
                id: 'f6', name: "Charishma", role: "Human Resource",
                bio: "Spread IoT awareness and led new member recruitment.",
                image: "/team/founding/image8.png", objPos: '50% 3%',
                linkedin: 'https://www.linkedin.com/in/charishma-garimella-138859209/',
            },
            {
                id: 'f7', name: "Ishika", role: "Human Resource",
                bio: "Conducted quiz-based sign-up drives and grew club membership.",
                image: "/team/founding/image12.png",
                linkedin: 'https://www.linkedin.com/in/joel-ishika-reddy-kandukuri-8ba748201/',
            },
            {
                id: 'f8', name: "Nidhish", role: "Human Resource",
                bio: "Handled outreach activities to recruit and onboard new members.",
                image: "/team/founding/image10.png",
                linkedin: 'https://www.linkedin.com/in/nidhish-pokala-4551b3254/',
            },
            {
                id: 'f9', name: "Sai Aditya", role: "Social Media",
                bio: "Kept club social pages active and informed members about all events.",
                image: "/team/founding/image11.png", objPos: '0% 56%',
                rotateDeg: 90,
            },
            {
                id: 'f10', name: "Vallabh", role: "Social Media",
                bio: "Grew the club's social media presence and connected with the broader IoT community.",
                image: "/team/founding/image13.png", objPos: '50% 83%',
                linkedin: 'https://www.linkedin.com/in/vallabh-akula-cse/',
            },
            {
                id: 'f11', name: "Nikitha", role: "Social Media",
                bio: "Kept all platforms active with updates on ongoing activities.",
                image: "/team/founding/image14.png",
            },
            {
                id: 'f12', name: "Rachana", role: "Organizing Manager",
                bio: "Arranged and organized club events, sessions, and guest lectures.",
                image: "/team/founding/image15.png",
                linkedin: 'https://www.linkedin.com/in/rachana-koyyala/',
            },
            {
                id: 'f13', name: "T. Tanishq", role: "Organizing Manager",
                bio: "Conducted events and interaction sessions for project idea development.",
                image: "/team/founding/image16.png",
            },
        ],
    },
    // ── Add future batches here ─────────────────────────────────────────────
    // {
    //     batchLabel: "Batch 2",
    //     year: "2021–25",
    //     members: [ ... ],
    // },
];


