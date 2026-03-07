import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glkaksrfoznewagmeusk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_KEY env variable.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function publishBlog() {
    const title = "Welcome to Interactive 3D Blogs!";
    const category = "Tutorial";
    const authorName = "Adithya (System)";
    // A cool cyberpunk/hacker neon image
    const imageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80";

    const content = `
Welcome to the real-time IoT Club CMS. You can now write full Markdown blogs directly from the Admin Command Center, and they will instantaneously synchronize to the Learning Hub. 

Here's an example of the incredibly powerful code blocks you can now generate, complete with Prism IDE-style syntax highlighting:

\`\`\`javascript
async function fetchSensorData(sensorId) {
    try {
        const response = await fetch(\`/api/sensors/\${sensorId}/telemetry\`);
        const data = await response.json();
        
        console.log(\`[System Status]: Sensor \${sensorId} is operating at \${data.efficiency}% capacity.\`);
        return data.payload;
    } catch (error) {
        console.error("Link broken: Unable to retrieve telemetry.");
    }
}

// Initialize Sequence
fetchSensorData('IOT-NEXUS-7A');
\`\`\`

## 🌀 Interactive 3D Models in the Browser

Thanks to \`<model-viewer>\`, you can embed lightweight AR-ready 3D objects (\`.glb\` or \`.gltf\` format) right into your blog posts. Users can spin, zoom, and interact with schemas without any plugins.

<model-viewer src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" auto-rotate camera-controls style="width: 100%; height: 500px; background-color: #050505; border-radius: 12px; border: 1px solid rgba(188,19,254,0.3);"></model-viewer>

### Where to find \`.glb\` models?

If you need models for your posts, you have several awesome options:
1. **[Sketchfab](https://sketchfab.com/)**: The ultimate repository for 3D content. You can search for "free downloadable" models, and Sketchfab will automatically convert almost any model into \`.glb format\` for you instantly upon download.
2. **[Google Model Viewer Assets](https://modelviewer.dev/shared-assets/models/)**: Small open-source example assets.
3. **[Khronos glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)**: A huge GitHub repository containing standardized \`.glb\` models of cameras, engines, drones, and test objects.
4. **AI Generation**: You can use tools like **[Luma AI (Genie)](https://lumalabs.ai/genie)** or **[Meshy](https://www.meshy.ai/)** to literally type a text prompt (e.g., "A futuristic cyberpunk IoT sensor grid") and it will generate a fully rotatable \`.glb\` model for you in 30 seconds!

To add them here, simply host the \`.glb\` file anywhere (like your public GitHub repo or an AWS S3 bucket), and paste the link into the **✨ Add 3D Model** template in the Blog Writer!
  `;

    try {
        const { error } = await supabase
            .from('blogs')
            .insert([
                {
                    title,
                    content,
                    category,
                    image_url: imageUrl,
                    author: authorName,
                }
            ]);

        if (error) {
            console.error('Failed to publish blog:', error.message);
        } else {
            console.log('Successfully published the demo 3D blog!');
        }

    } catch (e) {
        console.error(e);
    }
}

publishBlog();
