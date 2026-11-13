var hero = document.getElementById('hero');
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Glow that follows the pointer inside the hero
hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--x', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--y', (e.clientY - r.top) + 'px');
});

// Skills: tabs + animated bars
var G = {
    Frontend: [['HTML', 95], ['CSS and animations', 88], ['Responsive design', 90], ['Flexbox and Grid', 85]],
    JavaScript: [['DOM scripting', 80], ['ES6 and arrays', 78], ['LocalStorage', 82], ['Fetch and APIs', 65]],
    Tools: [['Git and GitHub', 75], ['VS Code', 92], ['Figma basics', 60], ['Chrome DevTools', 80]]
};
var tabs = document.getElementById('tabs');
var bars = document.getElementById('bars');

function show(name) {
    Array.prototype.forEach.call(tabs.children, function (b) {
        b.setAttribute('aria-selected', b.textContent === name);
    });
    bars.innerHTML = G[name].map(function (s) {
        return '<div class="bar"><div class="t"><span>' + s[0] + '</span><span>' + s[1] + '%</span></div><div class="tr"><div class="f" data-w="' + s[1] + '"></div></div></div>';
    }).join('');
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            Array.prototype.forEach.call(bars.querySelectorAll('.f'), function (f) {
                f.style.width = f.dataset.w + '%';
            });
        });
    });
}
Object.keys(G).forEach(function (n) {
    var b = document.createElement('button');
    b.className = 'tab';
    b.setAttribute('role', 'tab');
    b.textContent = n;
    b.onclick = function () { show(n); };
    tabs.appendChild(b);
});
show('Frontend');

// Light / dark theme toggle
document.getElementById('tg').onclick = function () {
    var r = document.documentElement;
    var dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark';
};

// Scrolling tech strip
var mt = ['HTML', 'CSS', 'JavaScript', 'Responsive design', 'Animations', 'Git', 'Figma', 'LocalStorage', 'APIs']
    .map(function (t) { return '<span>' + t + ' &#10022;</span>'; }).join('');
document.getElementById('mqi').innerHTML = mt + mt;

// Typing effect: "I am ..."
var rl = ['a Frontend Developer', 'a Responsive Web Designer', 'a JavaScript Problem Solver'];
var ri = 0, rc = 0, dl = false;
var rt = document.getElementById('rt');

function tick() {
    var w = rl[ri];
    if (reduce) { rt.textContent = w; return; }
    rt.textContent = w.slice(0, rc);
    if (!dl && rc < w.length) { rc++; setTimeout(tick, 90); }
    else if (!dl) { dl = true; setTimeout(tick, 1300); }
    else if (rc > 0) { rc--; setTimeout(tick, 45); }
    else { dl = false; ri = (ri + 1) % rl.length; setTimeout(tick, 350); }
}
tick();

// Scroll progress bar
var pgb = document.getElementById('pg');
addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    pgb.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
}, { passive: true });

// Reveal sections on scroll
var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
}, { threshold: .12 });
document.querySelectorAll('section>h2,.sub,.tabs,.grid,.contact,.mq').forEach(function (el) {
    el.classList.add('rv');
    io.observe(el);
});

// Desktop only: custom cursor, magnetic buttons, 3D card tilt
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    document.documentElement.classList.add('cur-on');
    var cd = document.getElementById('cd');
    var cr = document.getElementById('cr');
    var mx = -100, my = -100, rx = -100, ry = -100;

    addEventListener('pointermove', function (e) {
        mx = e.clientX; my = e.clientY;
        cd.style.opacity = 1; cr.style.opacity = 1;
    });
    document.addEventListener('pointerleave', function () {
        cd.style.opacity = 0; cr.style.opacity = 0;
    });
    (function loop() {
        rx += (mx - rx) * .16;
        ry += (my - ry) * .16;
        cd.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
        cr.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
        requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', function (e) {
        cr.classList.toggle('h', !!e.target.closest('a,button,.card,.row'));
    });
    addEventListener('pointerdown', function () { cr.classList.add('dn'); });
    addEventListener('pointerup', function () { cr.classList.remove('dn'); });

    document.querySelectorAll('.btn,.tg').forEach(function (b) {
        b.addEventListener('pointermove', function (e) {
            var r = b.getBoundingClientRect();
            b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .25) + 'px,' + ((e.clientY - r.top - r.height / 2) * .35) + 'px)';
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });

    document.querySelectorAll('.card').forEach(function (c) {
        c.addEventListener('pointermove', function (e) {
            var r = c.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - .5;
            var y = (e.clientY - r.top) / r.height - .5;
            c.style.transition = 'border-color .25s';
            c.style.transform = 'perspective(700px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateY(-6px)';
        });
        c.addEventListener('pointerleave', function () {
            c.style.transition = 'transform .4s,border-color .25s';
            c.style.transform = '';
        });
    });
}

/* =================================
   EMAILJS CONTACT FORM
================================= */

emailjs.init({
    publicKey: "45ABOOu2t0EQrw8-S"
});

var contactForm = document.getElementById("contact-form");
var sendBtn = document.getElementById("send-btn");
var formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    formStatus.textContent = "";

    emailjs.sendForm(
        "service_qf3ql9b",
        "template_un0kj5v",
        contactForm
    )
    .then(function () {
        formStatus.textContent = "Message sent successfully!";
        formStatus.style.color = "#2fb344";
        contactForm.reset();
    })
    .catch(function (error) {
        console.error("EmailJS Error:", error);
        formStatus.textContent =
            "Message could not be sent. Please try again.";
        formStatus.style.color = "#ff6b6b";
    })
    .finally(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Message";
    });
});