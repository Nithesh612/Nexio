require('dotenv').config();
const mongoose = require('mongoose');
const AITool = require('./models/AITool');

const uri = process.env.MONGODB_URI;

async function clearAITools() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri, { dbName: "wallet" });
        console.log("Connected.");
        
        console.log("Deleting all documents in ai-tools collection...");
        const result = await AITool.deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents.`);
        
        console.log("Done. Exiting.");
        process.exit(0);
    } catch (err) {
        console.error("Error clearing ai-tools:", err);
        process.exit(1);
    }
}

clearAITools();
