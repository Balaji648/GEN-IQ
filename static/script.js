function openTab(tabName) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    const buttons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.classList.add("active");
}

// Default to first tab
document.getElementsByClassName("tab-button")[0].click();

function generateImage() {
    const prompt = document.getElementById("image-prompt").value;
    fetch('/api/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to generate image');
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        document.getElementById("image-result").innerHTML = `<img src="${url}" alt="Generated Image">`;
    })
    .catch(error => document.getElementById("image-result").innerHTML = `Error: ${error.message}`);
}

function generateAudio() {
    const text = document.getElementById("audio-text").value;
    const lang = document.getElementById("audio-lang").value;
    fetch('/api/text-to-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to generate audio');
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        document.getElementById("audio-result").innerHTML = `<audio controls src="${url}"></audio><br><a href="${url}" download="output.mp3">Download</a>`;
    })
    .catch(error => document.getElementById("audio-result").innerHTML = `Error: ${error.message}`);
}

function summarizeText() {
    const text = document.getElementById("summary-text").value;
    const sentences = document.getElementById("summary-sentences").value;
    fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sentences: parseInt(sentences) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) throw new Error(data.error);
        document.getElementById("summary-result").innerHTML = "<h3>Summary:</h3><ol>" + data.summary.map(s => `<li>${s}</li>`).join('') + "</ol>";
    })
    .catch(error => document.getElementById("summary-result").innerHTML = `Error: ${error.message}`);
}

function debugCode() {
    const code = document.getElementById("code-input").value;
    fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) throw new Error(data.error);
        document.getElementById("code-result").innerHTML = `<pre>Issues:\n${data.issues}</pre><p>Explanation: ${data.explanation || 'None'}</p>`;
    })
    .catch(error => document.getElementById("code-result").innerHTML = `Error: ${error.message}`);
}

function checkAtsScore() {
    const resume = document.getElementById("resume-upload").files[0];
    const jobDesc = document.getElementById("job-desc").value;
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_desc', jobDesc);
    fetch('/api/ats-score', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) throw new Error(data.error);
        document.getElementById("ats-result").innerHTML = `<p>ATS Score: ${data.score}</p><p>Matches: ${data.matches.join(', ')}</p>`;
    })
    .catch(error => document.getElementById("ats-result").innerHTML = `Error: ${error.message}`);
}
