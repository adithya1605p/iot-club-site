export const fetchIoTNews = async () => {
    try {
        // Fetch recent Dev.to articles tagged with iot
        const res = await fetch('https://dev.to/api/articles?tag=iot&top=2&per_page=12');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();

        return data.map(article => ({
            id: article.id,
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.cover_image || article.social_image,
            source: 'Dev.to',
            publishedAt: new Date(article.published_at).toLocaleDateString()
        }));
    } catch (error) {
        console.error("News Fetch Error:", error);
        return [];
    }
};

export const fetchArxivPapers = async (searchQuery = 'all:iot OR all:embedded') => {
    try {
        // arXiv API for IoT or Embedded
        const query = searchQuery;
        const url = `/arxiv/api/query?search_query=${encodeURIComponent(query)}&start=0&max_results=8&sortBy=submittedDate&sortOrder=descending`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch papers ${res.status}`);
        const textData = await res.text();

        // Basic XML Parsing (browser native)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        const papers = [];
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            try {
                // Extract multiple authors safely
                const authorNodes = entry.getElementsByTagName("author");
                const authors = Array.from(authorNodes).map(node => node.getElementsByTagName("name")[0]?.textContent || '').filter(Boolean).join(", ");

                papers.push({
                    id: entry.getElementsByTagName("id")[0]?.textContent || `temp-${i}`,
                    title: entry.getElementsByTagName("title")[0]?.textContent?.replace(/\n\s+/g, " ").trim() || 'Untitled',
                    summary: entry.getElementsByTagName("summary")[0]?.textContent?.replace(/\n\s+/g, " ").trim() || 'No summary available.',
                    authors: authors || 'Unknown',
                    publishedAt: new Date(entry.getElementsByTagName("published")[0]?.textContent || Date.now()).toLocaleDateString(),
                    link: entry.getElementsByTagName("id")[0]?.textContent || '#'
                });
            } catch (e) {
                console.warn("Failed to parse a paper entry", e);
            }
        }

        return papers;
    } catch (error) {
        console.error("arXiv Fetch Error:", error);
        return [];
    }
};
