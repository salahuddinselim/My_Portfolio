import { Profile, Education, Experience } from "@/types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function generateATSResume(profile: Profile, education: Education[], experience: Experience[], projects: { title: string; description: string; tech_stack: string[] }[]): string {
  const lines: string[] = [];

  // Header - Name and Role
  lines.push((profile.name || "").toUpperCase());
  lines.push(profile.role || "");
  lines.push("");

  // Contact Information
  lines.push("CONTACT INFORMATION");
  lines.push("-----------------------------------");
  if (profile.phone) lines.push(`Phone: ${profile.phone}`);
  if (profile.email) lines.push(`Email: ${profile.email}`);
  if (profile.location) lines.push(`Location: ${profile.location}`);
  if (profile.linkedin_link) lines.push(`LinkedIn: ${profile.linkedin_link}`);
  if (profile.github_link) lines.push(`GitHub: ${profile.github_link}`);
  if (profile.twitter_link) lines.push(`Twitter: ${profile.twitter_link}`);
  lines.push("");

  // Professional Summary
  if (profile.bio) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("-----------------------------------");
    lines.push(profile.bio);
    lines.push("");
  }

  // Skills (will be added from skills array)
  lines.push("");

  // Education
  if (education.length > 0) {
    lines.push("EDUCATION");
    lines.push("-----------------------------------");
    education.forEach((edu) => {
      const dateRange = edu.current
        ? `${edu.start_date} - Present` 
        : `${edu.start_date} - ${edu.end_date}`;
      lines.push(`${edu.institution} | ${dateRange}`);
      lines.push(`  ${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ""}`);
      if (edu.grade) lines.push(`  Grade: ${edu.grade}`);
      if (edu.description) lines.push(`  ${edu.description}`);
      lines.push("");
    });
  }

  // Experience
  if (experience.length > 0) {
    lines.push("EXPERIENCE");
    lines.push("-----------------------------------");
    experience.forEach((exp) => {
      const dateRange = exp.current
        ? `${exp.start_date} - Present` 
        : `${exp.start_date} - ${exp.end_date}`;
      lines.push(`${exp.position} at ${exp.company} | ${dateRange}`);
      if (exp.location) lines.push(`  Location: ${exp.location}`);
      if (exp.description) {
        const descriptions = exp.description.split("\n");
        descriptions.forEach(desc => lines.push(`  ${desc.trim()}`));
      }
      lines.push("");
    });
  }

  // Projects
  if (projects.length > 0) {
    lines.push("PROJECTS");
    lines.push("-----------------------------------");
    projects.forEach((proj) => {
      lines.push(proj.title);
      if (proj.tech_stack && proj.tech_stack.length > 0) {
        lines.push(`  Technologies: ${proj.tech_stack.join(", ")}`);
      }
      if (proj.description) lines.push(`  ${proj.description}`);
      lines.push("");
    });
  }

  // Coursework
  if (profile.coursework) {
    lines.push("RELEVANT COURSEWORK");
    lines.push("-----------------------------------");
    lines.push(profile.coursework);
    lines.push("");
  }

  // Achievements
  if (profile.achievements) {
    lines.push("ACHIEVEMENTS");
    lines.push("-----------------------------------");
    lines.push(profile.achievements);
    lines.push("");
  }

  return lines.join("\n");
}

export function downloadResume(profile: Profile, education: Education[], experience: Experience[], projects: { title: string; description: string; tech_stack: string[] }[]) {
  const resumeContent = generateATSResume(profile, education, experience, projects);
  
  const blob = new Blob([resumeContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(profile.name || "Resume").replace(/\s+/g, "_")}_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateHTMLResume(profile: Profile, education: Education[], experience: Experience[], projects: { title: string; description: string; tech_stack: string[] }[], skills: string[]) {
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc.Programming) acc.Programming = [];
    if (!acc.Tools) acc.Tools = [];
    if (!acc.Concepts) acc.Concepts = [];
    
    if (['Java', 'Python', 'JavaScript', 'C', 'C++', 'TypeScript', 'Go', 'Rust'].includes(skill)) {
      acc.Programming.push(skill);
    } else if (['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'Git', 'Docker'].includes(skill)) {
      acc.Tools.push(skill);
    } else {
      acc.Concepts.push(skill);
    }
    return acc;
  }, { Programming: [] as string[], Tools: [] as string[], Concepts: [] as string[] });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 0.5in; size: A4; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      line-height: 1.5; 
      color: #1a1a1a; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 40px;
      background: white;
    }
    h1 { font-size: 24px; color: #1a1a1a; margin-bottom: 2px; letter-spacing: 0.5px; }
    .role { font-size: 14px; color: #2563eb; margin-bottom: 16px; }
    h2 { font-size: 14px; color: #2563eb; border-bottom: 1.5px solid #2563eb; padding-bottom: 4px; margin: 20px 0 12px; text-transform: uppercase; letter-spacing: 1px; }
    p { font-size: 11px; margin-bottom: 6px; color: #444; }
    .contact-info { margin-bottom: 16px; font-size: 10px; color: #555; }
    .contact-info span { margin-right: 16px; }
    .section { margin-bottom: 16px; }
    .item { margin-bottom: 12px; page-break-inside: avoid; }
    .item-header { display: flex; justify-content: space-between; margin-bottom: 2px; }
    .item-title { font-weight: 600; font-size: 12px; }
    .item-date { color: #666; font-size: 10px; }
    .item-sub { font-size: 11px; color: #555; }
    .item-sub2 { font-size: 10px; color: #666; font-style: italic; }
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 8px; }
    .skill-category { margin-bottom: 8px; }
    .skill-category-title { font-weight: 600; font-size: 11px; color: #2563eb; margin-bottom: 4px; }
    .skill { display: inline-block; background: #f3f4f6; padding: 2px 10px; border-radius: 3px; font-size: 10px; color: #374151; margin-right: 4px; margin-bottom: 4px; }
    @media print { 
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <h1>${profile.name}</h1>
  <p class="role">${profile.role}</p>
  
  <div class="contact-info">
    ${profile.phone ? `<span>📞 ${profile.phone}</span>` : ""}
    ${profile.email ? `<span>✉️ ${profile.email}</span>` : ""}
    ${profile.location ? `<span>📍 ${profile.location}</span>` : ""}
    ${profile.linkedin_link ? `<span>🔗 LinkedIn</span>` : ""}
    ${profile.github_link ? `<span>💻 GitHub</span>` : ""}
    ${profile.twitter_link ? `<span>🐦 Twitter</span>` : ""}
  </div>

  ${profile.bio ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <p>${profile.bio}</p>
  </div>
  ` : ""}

  ${skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills-grid">
      ${skillsByCategory.Programming.length > 0 ? `
      <div class="skill-category">
        <div class="skill-category-title">Programming Languages</div>
        ${skillsByCategory.Programming.map(s => `<span class="skill">${s}</span>`).join("")}
      </div>
      ` : ""}
      ${skillsByCategory.Tools.length > 0 ? `
      <div class="skill-category">
        <div class="skill-category-title">Tools & Technologies</div>
        ${skillsByCategory.Tools.map(s => `<span class="skill">${s}</span>`).join("")}
      </div>
      ` : ""}
      ${skillsByCategory.Concepts.length > 0 ? `
      <div class="skill-category">
        <div class="skill-category-title">Concepts</div>
        ${skillsByCategory.Concepts.map(s => `<span class="skill">${s}</span>`).join("")}
      </div>
      ` : ""}
    </div>
  </div>
  ` : ""}

  ${education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${education.map(edu => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${edu.institution}</span>
        <span class="item-date">${edu.current ? edu.start_date + " - Present" : edu.start_date + " - " + edu.end_date}</span>
      </div>
      <p class="item-sub">${edu.degree}${edu.field_of_study ? " in " + edu.field_of_study : ""}</p>
      ${edu.grade ? `<p class="item-sub2">Grade: ${edu.grade}</p>` : ""}
      ${edu.description ? `<p class="item-sub2">${edu.description}</p>` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${experience.length > 0 ? `
  <div class="section">
    <h2>Experience</h2>
    ${experience.map(exp => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${exp.position} at ${exp.company}</span>
        <span class="item-date">${exp.current ? exp.start_date + " - Present" : exp.start_date + " - " + exp.end_date}</span>
      </div>
      ${exp.location ? `<p class="item-sub">${exp.location}</p>` : ""}
      ${exp.description ? `<p>${exp.description.replace(/\n/g, "<br>")}</p>` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${projects.map(proj => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${proj.title}</span>
      </div>
      ${proj.tech_stack && proj.tech_stack.length > 0 ? `<p class="item-sub">Technologies: ${proj.tech_stack.join(", ")}</p>` : ""}
      ${proj.description ? `<p>${proj.description}</p>` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${profile.coursework ? `
  <div class="section">
    <h2>Relevant Coursework</h2>
    <p>${profile.coursework}</p>
  </div>
  ` : ""}

  ${profile.achievements ? `
  <div class="section">
    <h2>Achievements & Activities</h2>
    <p>${profile.achievements}</p>
  </div>
  ` : ""}
</body>
</html>
  `.trim();
}

export async function downloadPDF(profile: Profile, education: Education[], experience: Experience[], projects: { title: string; description: string; tech_stack: string[] }[], skills: string[]) {
  const htmlContent = generateHTMLResume(profile, education, experience, projects, skills);

  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "pdf-loading-indicator";
  loadingIndicator.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px 40px;border-radius:8px;z-index:99999;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-size:16px;";
  loadingIndicator.textContent = "Generating PDF...";
  document.body.appendChild(loadingIndicator);

  try {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const printWindow = window.open(url, "_blank");
    if (!printWindow) {
      throw new Error("Failed to open print window");
    }

    printWindow.onload = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const container = printWindow.document.body;

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 800,
          windowHeight: 1200,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        pdf.addImage(imgData, "PNG", imgX, imgY, finalWidth, finalHeight);
        pdf.save(`${(profile.name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`);

        printWindow.close();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("PDF generation error:", err);
        alert("Error generating PDF. Please try again.");
      }
    };
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Error generating PDF. Please try again.");
  } finally {
    const loader = document.getElementById("pdf-loading-indicator");
    if (loader) document.body.removeChild(loader);
  }
}