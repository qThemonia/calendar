const quotes = [
    //"\"Life is pleasant. Death is peaceful. It's the transition that's troublesome.\" - Isaac Asimov (1920-1992)",
    //"\"Be nice to people on your way up because you meet them on your way down.\" - Jimmy Durante (1893-1980)",
    //"\"If you want to make an apple pie from scratch, you must first create the universe.\" - Carl Sagan (1934-1996)",
    "\"Knowledge speaks, but wisdom listens.\" - Jimi Hendrix (1942-1970)",
    "\"Education is a progressive discovery of our own ignorance.\" - Will Durant (1885-1981)",
    "\"Obstacles are those frightful things you see when you take your eyes off your goal.\" - Henry Ford (1863-1947)",
    "\"While we are postponing, life speeds by.\" - Seneca (3BC-65AD)",
    //"\"First they ignore you, then they laugh at you, then they fight you, then you win.\" - Mahatma Gandhi (1869-1948)",
    "\"Most people would sooner die than think; in fact, they do so.\" - Bertrand Russell (1872-1970)",
    //"\"It has become appallingly obvious that our technology has exceeded our humanity.\" - Albert Einstein (1879-1955)",
    "\"The mistakes are all waiting to be made.\" - Chessmaster Savielly Grigorievitch Tartakower (1887-1956)",
    "\"Try not. Do, or do not. There is no 'try'.\" - Yoda",
    "\"I may not have gone where I intended to go, but I think I have ended up where I needed to be.\" - Douglas Adams (1952-2001)",
    //"\"Tell me, o Muse, of that ingenious hero who travelled far and wide...\" - Homer's Odyssey (800BC)",
    "\"Whatever trip we start, it is for the search of happiness. But happiness is here.\" - Quintus Flaccus (238-209)",
    "\"Nothing is constant but change.\" - Sakyamuni, founder of Buddhism (563-483)",
    "\"The only ones who fly are the ones who dare to fly.\" - Luis Sepulveda, Chilean writer (1949-)",
    "\"Stars are holes in the sky from which the light of the infinite shines.\" - Confucius (551-479)",
    //"\"While the other animals are prone and fix their gaze on the earth, the god gave man a face uplifted, bade him stand erect and turn his eyes to the stars.\" - Publius Ovidius Naso (Metamorphoses I. 84-6)",
    //"\"The greatest thing You'll ever learn Is just to love and Be loved in return\" - Eden Ahbez (1908-1995)",
    //"\"May god stand between you and harm, in all the dark places you must walk.\" - Ancient Egyptian Proverb",
    "\"To win one hundred victories in one hundred battles is not the highest skill. To subdue the enemy without fighting, is the highest skill.\" - Sun-Tsu (500BC)",
    "\"There must be something worth living for There must be something worth trying for Even some things worth dying for And if one man can stand tall There must be some hope for us all Somewhere, somewhere in the spirit of man\" - War of the Worlds musical by Jeff Wayne",
    //"\"Mother, I saw a dream in the night. There were stars in the sky for me.\" - The Epic of Gilgamesh (around 800 BC)",
    //"\"The greatest gain from space travel consists in the extension of our knowledge. In a hundred years this newly won knowledge will pay huge and unexpected dividends.\" - Wernher von Braun (1912-1977)",
    "\"To go places and do things that have never been done before - that's what living is all about.\" - Michael Collins (1930-)",
    "\"It's human nature to stretch, to go, to see, to understand. Exploration is not a choice, really; it's an imperative.\" - Michael Collins (1930-)",
    "\"Don't tell me that man doesn't belong out there. Man belongs wherever he wants to go - and he'll do plenty well when he gets there.\" - Wernher von Braun (1912-1977)",
    "\"Hold fast to dreams, for if dreams die, life is a broken bird that cannot fly.\" - Langston Hughes (1902-1967)",
    "\"Minds are like parachutes - they only function when open.\" - Thomas Dewar (1864-1930)",
    //"\"Shoot for the moon. Even if you miss, you'll land among the stars.\" - Les Brown (1945-)",
    "\"What is now proved was once only imagined.\" - William Blake (1757-1827)",
    "\"Even a fool knows you can't touch the stars, but it doesn't stop a wise man from trying.\" - Harry Anderson (1952-2018)",
    //"\"And if you gaze for long into an abyss, the abyss gazes also into you.\" - Friedrich Nietzsche (1844-1900)",
    //"\"Following the light of the sun, we left the Old World.\" - Inscription on Columbus' caravels",
    //"\"Throw your dreams into space like a kite, and you do not know what it will bring back, a new life, a new friend, a new love, a new country.\" - Anais Nin (1903-1977)",
    "\"If you can imagine it, you can achieve it. If you can dream it, you can become it.\" - William Arthur Ward (1921-1994)",
    "\"Imagination is the only weapon in the war against reality.\" - Jules de Gautier (1811-1872)",
    "\"The journey is the reward.\" - Taoist Saying",
    "\"It is good to have an end to journey toward, but it is the journey that matters in the end.\" - Ursula K. LeGuin (1929-2018)",
    "\"The universe is full of magical things patiently waiting for our wits to grow sharper.\" - Eden Phillpotts (1862-1960)",
    "\"Your current safe boundaries were once unknown frontiers.\" - Unknown",
    "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt (1884-1962)",
    "\"Dreams are renewable. No matter what our age or condition, there are still untapped possibilities within us and new beauty waiting to be born.\" - Dale Turner",
    "\"There is a single light of science, and to brighten it anywhere is to brighten it everywhere.\" - Isaac Asimov (1920-1992)",
    "\"Reality is that part of the imagination we all agree on.\" - Unknown",
    "\"The most beautiful thing we can experience is the mysterious. It is the source of all true art and science.\" - Albert Einstein (1879-1955)",
    "\"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.\" - Albert Einstein (1879-1955)",
    "\"When I examine myself and my methods of thought, I come to the conclusion that the gift of fantasy has meant more to me than my talent for absorbing positive knowledge.\" - Albert Einstein (1879-1955)",
    "\"As far as the laws of mathematics refer to reality, they are not certain; and as far as they are certain, they do not refer to reality.\" - Albert Einstein (1879-1955)",
    "\"Any sufficiently advanced technology is indistinguishable from magic.\" - Arthur C. Clarke (1917-2008)",
    //"\"Time is the fire in which we burn.\" - Delmore Schwartz (1913-1966)",
    //"\"I don't know what you could say about a day in which you have seen four beautiful sunsets.\" - John Glenn (1921-2016)",
    //"\"It suddenly struck me that that tiny pea, pretty and blue, was the Earth. I put up my thumb and shut one eye, and my thumb blotted out the planet Earth. I didn't feel like a giant. I felt very, very small.\" - Neil Armstrong (1930-2012)",
    "\"To confine our attention to terrestrial matters would be to limit the human spirit.\" - Stephen Hawking (1942-2018)",
    "\"Science-fiction yesterday, fact today, obsolete tomorrow.\" - Otto O. Binder (1911-1974)",
    "\"There shall be wings! If the accomplishment be not for me, 'tis for some other. The spirit cannot die; and man, who shall know all and shall have wings...\" - Leonardo da Vinci (1452-1519)",
    "\"Man's mind and spirit grow with the space in which they are allowed to operate.\" - Krafft A. Ehricke (1917-1984)",
    "\"The important thing is not to stop questioning.\" - Albert Einstein (1879-1955)",
    "\"You would make a ship sail against the winds and currents by lighting a bonfire under her deck...I have no time for such nonsense.\" - Napoleon Bonaparte (1769-1821)",
    "\"The Earth is a cradle of the mind, but we cannot live forever in a cradle.\" - Konstantin E. Tsiolkovsky (1857-1935)",
    //"\"Two possibilities exist: Either we are alone in the Universe or we are not. Both are equally terrifying.\" - Arthur C. Clarke (1917-2008)",
    "\"Space isn't remote at all. It's only an hour's drive away, if your car could go straight upwards.\" - Sir Fred Hoyle (1915-2001)",
    //"\"Space is big. Really big.\" - Douglas Adams (1952-2001)",
    //"\"I measured the skies Now the shadows I measure Skybound was the mind Earthbound the body rests.\" - Johannes Kepler (1571-1630)",
    "\"Discovery consists of seeing what everybody has seen and thinking what nobody has thought.\" - Albert Szent-Gyorgyi (1893-1986)",
    "\"Whether outwardly or inwardly, whether in space or time, the farther we penetrate the unknown, the vaster and more marvellous it becomes.\" - Charles A. Lindbergh (1902-1974)"
  ];

export function passQuotes() {
    return quotes.length;
}