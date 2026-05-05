import * as React from 'react';
import { useState } from 'react';

const HERO_IMG = 'https://images.squarespace-cdn.com/content/v1/5581bda7e4b02bccca0ea49e/df0f0daa-d754-4e7f-a1c3-5829a67d15fb/Parigi_Teresa_Rafidi.jpg';
const FOOD_IMG_1 = 'https://images.squarespace-cdn.com/content/v1/5581bda7e4b02bccca0ea49e/1716745713819-LVCAH6CF2Y35X5ALABSS/IMG_0602.jpeg';
const FOOD_IMG_2 = 'https://images.squarespace-cdn.com/content/v1/5581bda7e4b02bccca0ea49e/1716769244166-FVBYKPM35YCDWOFK0UE5/XOXO.jpg';
const LOGO_IMG = 'https://images.squarespace-cdn.com/content/v1/5581bda7e4b02bccca0ea49e/1531513559666-LZKZH1290OJSCRZPNX0A/round.parigi+logo.png';

type MenuTab = 'lunch' | 'brunch' | 'desserts' | 'drinks';

interface MenuItem { name: string; desc: string; price: string; }
interface MenuSection { title: string; items: MenuItem[]; }
interface MenuCategory { label: string; sections: MenuSection[]; }

const MENU_DATA: Record<MenuTab, MenuCategory> = {
  lunch: {
    label: 'Lunch & Dinner',
    sections: [
      {
        title: 'Starters',
        items: [
          { name: 'French Onion Soup', desc: 'Gruyère crouton, rich beef broth', price: '$14' },
          { name: 'Steak Tartare', desc: 'Capers, shallots, Dijon, crostini', price: '$18' },
          { name: 'Escargot', desc: 'Garlic herb butter, toasted baguette', price: '$16' },
          { name: 'Charcuterie', desc: "Chef's selection of cured meats & accompaniments", price: '$22' },
        ],
      },
      {
        title: 'Mains',
        items: [
          { name: 'Duck Confit', desc: 'Lentils du Puy, mustard jus, crispy skin', price: '$38' },
          { name: 'Pan-Seared Salmon', desc: 'Beurre blanc, haricots verts, fingerling potatoes', price: '$34' },
          { name: 'Steak Frites', desc: '10oz hanger steak, herb butter, pommes frites', price: '$42' },
          { name: 'Chicken Provençal', desc: 'Olives, tomatoes, herbes de Provence', price: '$32' },
        ],
      },
    ],
  },
  brunch: {
    label: 'Brunch',
    sections: [
      {
        title: 'Brunch Favorites',
        items: [
          { name: 'Croque Madame', desc: 'Ham, Gruyère, béchamel, sunny-side egg', price: '$18' },
          { name: 'Eggs Benedict', desc: 'Smoked salmon, hollandaise, English muffin', price: '$20' },
          { name: 'French Toast', desc: 'Brioche, fresh berries, crème fraîche', price: '$16' },
          { name: 'Omelette du Chef', desc: 'Fines herbes, goat cheese, seasonal vegetables', price: '$17' },
        ],
      },
      {
        title: 'Brunch Cocktails',
        items: [
          { name: 'Classic Mimosa', desc: 'Prosecco, fresh-squeezed orange juice', price: '$12' },
          { name: 'Bloody Mary', desc: 'House Bloody mix, vodka, celery salt rim', price: '$14' },
          { name: 'Kir Royale', desc: 'Crème de cassis, Champagne', price: '$15' },
        ],
      },
    ],
  },
  desserts: {
    label: 'Desserts',
    sections: [
      {
        title: 'Desserts',
        items: [
          { name: 'Crème Brûlée', desc: 'Classic vanilla custard, caramelized sugar', price: '$12' },
          { name: 'Tarte Tatin', desc: 'Caramelized apple, puff pastry, crème fraîche', price: '$13' },
          { name: 'Chocolate Fondant', desc: 'Warm dark chocolate, vanilla ice cream', price: '$14' },
          { name: 'Île Flottante', desc: 'Floating island, crème anglaise, praline', price: '$11' },
        ],
      },
    ],
  },
  drinks: {
    label: 'Drinks',
    sections: [
      {
        title: 'Cocktails',
        items: [
          { name: 'Parigi Negroni', desc: 'Gin, Campari, sweet vermouth, orange peel', price: '$15' },
          { name: 'French 75', desc: 'Gin, lemon, simple syrup, Champagne', price: '$16' },
          { name: 'Sidecar', desc: 'Cognac, Cointreau, lemon juice, sugar rim', price: '$17' },
        ],
      },
      {
        title: 'Wine by the Glass',
        items: [
          { name: 'Sancerre', desc: 'Loire Valley — crisp & mineral', price: '$18' },
          { name: 'Burgundy Pinot Noir', desc: 'Côte de Nuits — silky, earthy', price: '$20' },
          { name: 'Côtes du Rhône', desc: 'Grenache blend — robust & spiced', price: '$14' },
        ],
      },
    ],
  },
};

const NAV_LINKS = ['Menu', 'Story', 'Reservations', 'Daily Specials', 'Location'];

export function ParigiPage() {
  const [menuTab, setMenuTab] = useState<MenuTab>('lunch');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menu = MENU_DATA[menuTab];

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1a1a1a] font-serif">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-[#faf8f4]/95 backdrop-blur border-b border-[#e8e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <img src={LOGO_IMG} alt="Parigi" className="h-10 w-10 rounded-full object-cover" />
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link} href="#" onClick={e => e.preventDefault()}
                className="text-xs tracking-widest uppercase text-[#555] hover:text-[#1a1a1a] transition-colors font-sans">
                {link}
              </a>
            ))}
          </nav>
          <a href="#" onClick={e => e.preventDefault()}
            className="hidden md:block bg-[#1a1a1a] text-white text-xs tracking-widest uppercase font-sans px-5 py-2 hover:bg-[#333] transition-colors">
            Reserve
          </a>
          <button className="md:hidden p-2 text-[#1a1a1a]" onClick={() => setMobileNavOpen(v => !v)} aria-label="Toggle menu">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-all ${mobileNavOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-all ${mobileNavOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-all ${mobileNavOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden bg-[#faf8f4] border-t border-[#e8e0d0] px-4 pb-4 pt-2 flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <a key={link} href="#" onClick={e => { e.preventDefault(); setMobileNavOpen(false); }}
                className="text-xs tracking-widest uppercase text-[#555] font-sans py-1">{link}</a>
            ))}
            <a href="#" onClick={e => e.preventDefault()}
              className="mt-2 bg-[#1a1a1a] text-white text-xs tracking-widest uppercase font-sans px-5 py-3 text-center">
              Reserve a Table
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <img src={HERO_IMG} alt="Chef Janice Provost"
          className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 text-white">
          <p className="text-xs tracking-[0.3em] uppercase font-sans mb-3 text-[#d4a853]">Oak Lawn, Dallas — Est. 1986</p>
          <h1 className="text-5xl sm:text-7xl font-serif font-light leading-none mb-4">Parigi</h1>
          <p className="text-base sm:text-lg font-sans font-light text-white/80 max-w-md mb-8">
            A Dallas institution. Forty years of French-American cuisine, warmth, and culinary artistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" onClick={e => e.preventDefault()}
              className="inline-block bg-white text-[#1a1a1a] text-xs tracking-widest uppercase font-sans px-8 py-3 text-center hover:bg-[#f0ece4] transition-colors">
              Make a Reservation
            </a>
            <a href="#menu" onClick={e => e.preventDefault()}
              className="inline-block border border-white/60 text-white text-xs tracking-widest uppercase font-sans px-8 py-3 text-center hover:bg-white/10 transition-colors">
              View Menu
            </a>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <section className="bg-[#1a1a1a] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-[#d4a853] text-xs tracking-widest uppercase font-sans mb-2">Location</p>
            <p className="text-sm font-sans">3311 Oak Lawn Avenue</p>
            <p className="text-sm font-sans">Dallas, Texas 75219</p>
          </div>
          <div>
            <p className="text-[#d4a853] text-xs tracking-widest uppercase font-sans mb-2">Hours</p>
            <p className="text-sm font-sans">Mon–Thu 11:30 – 9:00 pm</p>
            <p className="text-sm font-sans">Fri 11:30 – 10:00 pm</p>
            <p className="text-sm font-sans">Sat–Sun Brunch 10:30 – 2:30 pm</p>
          </div>
          <div>
            <p className="text-[#d4a853] text-xs tracking-widest uppercase font-sans mb-2">Contact</p>
            <p className="text-sm font-sans">(214) 521-0295</p>
            <p className="text-sm font-sans mt-1">Complimentary Valet Parking</p>
            <p className="text-xs font-sans text-white/60 mt-1">Reservations highly recommended</p>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-20 px-4 max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase font-sans text-[#888] text-center mb-3">Our Offerings</p>
        <h2 className="text-4xl font-serif font-light text-center mb-10">The Menu</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {(Object.keys(MENU_DATA) as MenuTab[]).map(tab => {
            const isActive = tab === menuTab;
            return (
              <button key={tab} onClick={() => setMenuTab(tab)}
                className={`text-xs tracking-widest uppercase font-sans px-6 py-2.5 border transition-colors ${isActive
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-transparent text-[#555] border-[#ccc] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}>
                {MENU_DATA[tab].label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {menu.sections.map(section => (
            <div key={section.title}>
              <h3 className="text-xs tracking-widest uppercase font-sans text-[#888] mb-6 pb-2 border-b border-[#e8e0d0]">
                {section.title}
              </h3>
              <div className="space-y-6">
                {section.items.map(item => (
                  <div key={item.name} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-serif text-lg leading-tight">{item.name}</p>
                      <p className="text-sm text-[#888] font-sans mt-0.5">{item.desc}</p>
                    </div>
                    <p className="font-sans text-sm text-[#555] shrink-0 mt-1">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-sans text-[#aaa] mt-12">
          Menu items and prices subject to change. Please ask your server about daily specials and dietary accommodations.
        </p>
      </section>

      {/* Story */}
      <section className="bg-[#f0ece4] py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase font-sans text-[#888] mb-3">Our Story</p>
            <h2 className="text-4xl font-serif font-light mb-6">Forty Years in Oak Lawn</h2>
            <p className="text-base font-sans text-[#555] leading-relaxed mb-4">
              Since 1986, Parigi has been a cornerstone of Dallas dining. Chef-proprietor Janice Provost has spent four decades crafting a menu that blends French technique with Italian warmth and American spirit — always rooted in the best local and seasonal ingredients.
            </p>
            <p className="text-base font-sans text-[#555] leading-relaxed mb-8">
              What began as a neighborhood bistro has become a Dallas institution, beloved by regulars and newcomers alike. The dining room hums with the kind of energy that only comes from a place that truly cares about its guests.
            </p>
            <a href="#" onClick={e => e.preventDefault()}
              className="inline-block border border-[#1a1a1a] text-[#1a1a1a] text-xs tracking-widest uppercase font-sans px-8 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors">
              Read Our Full Story
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={FOOD_IMG_1} alt="Parigi dish" className="w-full h-64 object-cover" />
            <img src={FOOD_IMG_2} alt="Parigi atmosphere" className="w-full h-64 object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Daily Specials CTA */}
      <section className="py-20 px-4 text-center max-w-2xl mx-auto">
        <p className="text-xs tracking-widest uppercase font-sans text-[#888] mb-3">Always Changing</p>
        <h2 className="text-4xl font-serif font-light mb-4">{"Today's Specials"}</h2>
        <p className="text-base font-sans text-[#555] leading-relaxed mb-8">
          {"Chef Janice crafts new specials every day, inspired by the season and what's freshest at market. The best reason to come back often."}
        </p>
        <a href="#" onClick={e => e.preventDefault()}
          className="inline-block bg-[#1a1a1a] text-white text-xs tracking-widest uppercase font-sans px-10 py-4 hover:bg-[#333] transition-colors">
          {"See Today's Specials"}
        </a>
      </section>

      {/* Reservations */}
      <section id="reservations" className="bg-[#1a1a1a] text-white py-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[#d4a853] text-xs tracking-widest uppercase font-sans mb-3">Join Us</p>
          <h2 className="text-4xl font-serif font-light mb-4">Make a Reservation</h2>
          <p className="text-white/70 font-sans text-sm mb-10">
            Reservations are highly recommended. Walk-ins welcome based on availability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Your Name"
              className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm font-sans outline-none focus:border-[#d4a853] transition-colors w-full" />
            <input type="email" placeholder="Email Address"
              className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm font-sans outline-none focus:border-[#d4a853] transition-colors w-full" />
            <input type="date"
              className="bg-white/10 border border-white/20 text-white/70 px-4 py-3 text-sm font-sans outline-none focus:border-[#d4a853] transition-colors w-full" />
            <select className="bg-white/10 border border-white/20 text-white/70 px-4 py-3 text-sm font-sans outline-none focus:border-[#d4a853] transition-colors w-full">
              <option value="">Party size</option>
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
          <button className="w-full bg-[#d4a853] text-[#1a1a1a] text-xs tracking-widest uppercase font-sans py-4 hover:bg-[#c49543] transition-colors font-semibold">
            Request Reservation
          </button>
          <p className="text-white/40 text-xs font-sans mt-4">Or call us at (214) 521-0295</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white/50 py-10 px-4 text-center font-sans text-xs">
        <img src={LOGO_IMG} alt="Parigi" className="h-8 w-8 rounded-full object-cover mx-auto mb-4 opacity-60" />
        <p className="mb-1">3311 Oak Lawn Avenue, Dallas, TX 75219 · (214) 521-0295</p>
        <p className="mb-4">© 2025 Parigi Restaurant · All Rights Reserved</p>

      </footer>
    </div>
  );
}
