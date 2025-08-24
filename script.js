let activeTab = 0;
let tabCount = 2; // start with 2 tabs

function switchTab(index) {
    // hide all results
    for (let i = 0; i < tabCount; i++) {
        document.getElementById(`results-${i}`).classList.remove('active');
        document.getElementsByClassName('tab')[i].classList.remove('active');
    }
    // show selected tab
    document.getElementById(`results-${index}`).classList.add('active');
    document.getElementsByClassName('tab')[index].classList.add('active');
    activeTab = index;
}

function addTab() {
    if(tabCount >= 5) return; // max 5 tabs
    const resultsContainer = document.getElementById('resultsContainer');
    const newResults = document.createElement('div');
    newResults.className = 'results';
    newResults.id = `results-${tabCount}`;
    resultsContainer.appendChild(newResults);

    const tabsContainer = document.querySelector('.tabs');
    const newTab = document.createElement('div');
    newTab.className = 'tab';
    newTab.textContent = `Tab ${tabCount+1}`;
    newTab.setAttribute('onclick', `switchTab(${tabCount})`);
    tabsContainer.insertBefore(newTab, document.querySelector('.new-tab-btn'));

    tabCount++;
    switchTab(tabCount - 1);
}

async function search() {
    const query = document.getElementById("queryInput").value.trim();
    const resultsDiv = document.getElementById(`results-${activeTab}`);
    
    if(!query){
        resultsDiv.textContent = "Please enter a query!";
        return;
    }

    if(query.toLowerCase().startsWith("gpt:")){
        const prompt = query.substring(4).trim();
        resultsDiv.textContent = "Fetching answer from Server...";

        try {
            const response = await fetch("https://api.openai.com/v1/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: prompt,
                    max_tokens: 300,
                    temperature: 0.7
                })
            });
            const data = await response.json();
            resultsDiv.textContent = data.choices[0].text.trim();
        } catch (error) {
            resultsDiv.textContent = "Error fetching ChatGPT answer:\n" + error;
        }
    } else {
        resultsDiv.textContent = `Search History: ${query}`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
}
