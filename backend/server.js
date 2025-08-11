import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/repo/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    // Basic repo info
    const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);

    // Last 10 commits
    const commitsRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`);

    // Top 10 contributors
    const contributorsRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`);

    // Languages
    const languagesRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`);

    // Open issues count is already part of repoRes.data.open_issues_count
    // But GitHub API counts PRs as issues too, so if you want strictly issues, you need extra API calls
    // For simplicity, we’ll use open_issues_count as is

    res.json({
      repo: repoRes.data,
      commits: commitsRes.data,
      contributors: contributorsRes.data,
      languages: languagesRes.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch repository data." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
