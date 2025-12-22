import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWGcagecOrdCn7BuBeA72ICFkeH7QWePc",
    authDomain: "nexus-hub-caeab.firebaseapp.com",
    databaseURL: "https://nexus-hub-caeab-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nexus-hub-caeab",
    storageBucket: "nexus-hub-caeab.firebasestorage.app",
    messagingSenderId: "45490042276",
    appId: "1:45490042276:web:5dd49816f386fc23193d31",
    measurementId: "G-MM3NHNWYZX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const marqueeEl = document.getElementById("scrolling-announcements");
const pinnedEl = document.getElementById("pinned-announcement");
const pinnedTitle = document.getElementById("pinned-title");
const pinnedMsg = document.getElementById("pinned-msg");
const pinnedTime = document.getElementById("pinned-time");
const listEl = document.getElementById("announcement-list");

function timeAgo(ts) {
    const sec = Math.floor((Date.now() - ts) / 1000);
    if (sec < 60) return "Just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return `${Math.floor(hr / 24)}d ago`;
}

const catStyle = {
    "alert": { bg: "bg-red-500/10 border-red-500/20", icon: "fa-triangle-exclamation text-red-500", label: "Alert" },
    "update": { bg: "bg-blue-500/10 border-blue-500/20", icon: "fa-bullhorn text-blue-500", label: "Update" },
    "maintenance": { bg: "bg-yellow-500/10 border-yellow-500/20", icon: "fa-screwdriver-wrench text-yellow-500", label: "Maintenance" }
};

onValue(ref(db, "scrolling_text/value"), snap => {
    const text = snap.val() || "Welcome to Nexus Hub!";
    if (marqueeEl) marqueeEl.textContent = text;
});

onValue(ref(db, "pinned"), snap => {
    const data = snap.val();
    if (!data) {
        if (pinnedEl) pinnedEl.classList.add("hidden");
        return;
    }
    const key = Object.keys(data)[0];
    const ann = data[key];
    if (pinnedTitle) pinnedTitle.textContent = ann.title;
    if (pinnedMsg) pinnedMsg.textContent = ann.message;
    if (pinnedTime) pinnedTime.textContent = timeAgo(ann.timestamp);
    if (pinnedEl) pinnedEl.classList.remove("hidden");
});

onValue(ref(db, "announcements"), snap => {
    const data = snap.val();
    if (listEl) listEl.innerHTML = "";
    if (!data) return;

    const arr = Object.keys(data)
        .map(k => ({ id: k, ...data[k] }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

    arr.forEach(a => {
        const c = catStyle[a.category] || catStyle.update;
        const item = document.createElement("div");
        item.className = `p-4 rounded-xl border ${c.bg} hover:bg-white/5 transition-colors cursor-pointer group`;
        item.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex gap-4">
                    <div class="mt-1"><i class="fa-solid ${c.icon} text-xl"></i></div>
                    <div>
                        <h4 class="font-bold text-white group-hover:text-indigo-300 transition-colors">${a.title}</h4>
                        <p class="text-xs text-slate-400 mt-1">${timeAgo(a.timestamp)}</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-down text-white/20 group-hover:text-white/50 transition-colors"></i>
            </div>
            <div class="hidden mt-4 pt-4 border-t border-white/5 text-slate-300 text-sm leading-relaxed">${a.message}</div>
        `;
        item.addEventListener("click", () => {
            const msg = item.querySelector("div.hidden, div.mt-4");
            msg.classList.toggle("hidden");
            const icon = item.querySelector(".fa-chevron-down");
            icon.classList.toggle("rotate-180");
        });
        if (listEl) listEl.appendChild(item);
    });
});
