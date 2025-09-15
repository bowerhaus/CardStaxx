import { StackData, ConnectionData, CARD_COLORS } from '../types';

// Generate demo data for Lord of the Rings movie analysis
export const generateMovieDemoData = (): { stacks: StackData[], connections: ConnectionData[] } => {
  const baseDate = new Date('2023-10-01');
  const getDateOffset = (days: number) => new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  const stacks: StackData[] = [
    // Characters Stack - Medium size (170% - 340x294)
    {
      id: 'characters-stack',
      x: 50,
      y: 50,
      title: 'Key Characters',
      cards: [
        {
          id: 'frodo-card',
          title: 'Frodo Baggins',
          content: '# The Ring Bearer\n\n**Character Arc**: Innocent hobbit → Burdened hero → Transformed soul\n\n## Key Traits:\n- **Courage**: Despite his small stature and peaceful nature\n- **Compassion**: Shows mercy to Gollum repeatedly\n- **Burden**: Carries the weight of the Ring\'s corruption\n\n## Character Development:\n> "I will take the Ring, though I do not know the way."\n\n*The Ring\'s influence grows throughout the trilogy, showing Frodo\'s gradual transformation from carefree hobbit to a soul marked by his quest.*',
          date: getDateOffset(1),
          key: 'lotr-trilogy',
          tags: ['character', 'protagonist', 'hobbit'],
          backgroundColor: CARD_COLORS.LIGHT_BLUE,
          width: 442,  // 221% of 200 (170% * 1.3)
          height: 382  // 221% of 173 (170% * 1.3)
        },
        {
          id: 'aragorn-card',
          title: 'Aragorn',
          content: '# The Reluctant King\n\n**Character Arc**: Ranger in exile → Accepting destiny → Crowned King\n\n## Leadership Journey:\n- **Reluctance**: Initially refuses his birthright\n- **Growth**: Learns to lead through the Fellowship\n- **Acceptance**: Embraces his role as Gondor\'s king\n\n## Symbolic Elements:\n- **Andúril**: Reforged sword representing restored lineage\n- **The Paths of the Dead**: Confronting the past\n- **Coronation**: Full circle transformation\n\n*"You bow to no one." - A king who serves his people.*',
          date: getDateOffset(2),
          key: 'lotr-trilogy',
          tags: ['character', 'king', 'ranger', 'leadership'],
          backgroundColor: CARD_COLORS.LIGHT_GREEN,
          width: 442,  // 221% of 200 (170% * 1.3)
          height: 382  // 221% of 173 (170% * 1.3)
        },
        {
          id: 'gandalf-card',
          title: 'Gandalf',
          content: '# The Guide and Mentor\n\n**Role**: Wizard guide who dies and returns transformed\n\n## Gandalf the Grey vs. Gandalf the White:\n\n### The Grey:\n- Cautious, mysterious\n- Guides through wisdom\n- Falls to save the Fellowship\n\n### The White:\n- More powerful, direct\n- Military leader\n- Divine purpose revealed\n\n## Key Quotes:\n> "All we have to decide is what to do with the time that is given us."\n\n> "I am a servant of the Secret Fire, wielder of the flame of Anor."\n\n*Represents hope, wisdom, and divine intervention in dark times.*',
          date: getDateOffset(3),
          key: 'lotr-trilogy',
          tags: ['character', 'wizard', 'mentor', 'transformation'],
          backgroundColor: CARD_COLORS.LIGHT_YELLOW,
          width: 442,  // 221% of 200 (170% * 1.3)
          height: 382  // 221% of 173 (170% * 1.3)
        },
        {
          id: 'gollum-card',
          title: 'Gollum/Sméagol',
          content: '# The Tragic Anti-Hero\n\n**Duality**: Split personality showing the Ring\'s corrupting power\n\n## Sméagol vs. Gollum:\n- **Sméagol**: Remnant of original hobbit-like being\n- **Gollum**: Ring-corrupted, obsessive persona\n- **Internal Conflict**: Visual representation of addiction/corruption\n\n## Narrative Function:\n- **Mirror**: Shows what Frodo could become\n- **Guide**: Leads to Mordor (with ulterior motives)\n- **Catalyst**: His destruction of the Ring saves Middle-earth\n\n## Redemption Theme:\n> "We wants it, we needs it. Must have the precious."\n\n*Represents both the Ring\'s ultimate power and the possibility of redemption through unexpected means.*',
          date: getDateOffset(4),
          key: 'lotr-trilogy',
          tags: ['character', 'anti-hero', 'corruption', 'redemption'],
          backgroundColor: CARD_COLORS.LIGHT_GRAY,
          width: 442,  // 221% of 200 (170% * 1.3)
          height: 382  // 221% of 173 (170% * 1.3)
        }
      ]
    },

    // Themes Stack - Large size (190% - 380x329)
    {
      id: 'themes-stack',
      x: 600,
      y: 50,
      title: 'Central Themes',
      cards: [
        {
          id: 'good-vs-evil-card',
          title: 'Good vs Evil',
          content: '# The Central Moral Conflict\n\n## Manifestations:\n\n### **Visual Symbolism**:\n- **Light vs Dark**: Rivendell/Lothlórien vs Mordor/Isengard\n- **Colors**: White (Gandalf, Gandalf\'s horse) vs Black (Nazgûl, Sauron)\n- **Nature**: Flourishing vs Corruption (Fangorn vs Dead Marshes)\n\n### **Character Alignments**:\n- **Pure Good**: Aragorn, Legolas, Gimli\n- **Corrupted**: Saruman, Boromir (temporarily)\n- **Ambiguous**: Gollum, Denethor\n\n### **The Ring as Corruption**:\n- Absolute power corrupts absolutely\n- Even good characters (Boromir, Faramir) are tempted\n- Only the "small" can resist (hobbits)\n\n*The triumph of good requires sacrifice and the rejection of power.*',
          date: getDateOffset(5),
          key: 'lotr-trilogy',
          tags: ['theme', 'morality', 'symbolism'],
          backgroundColor: CARD_COLORS.LIGHT_PURPLE,
          width: 494,  // 247% of 200 (190% * 1.3)
          height: 428  // 247% of 173 (190% * 1.3)
        },
        {
          id: 'power-corruption-card',
          title: 'Power & Corruption',
          content: '# The Seductive Nature of Power\n\n## The One Ring\'s Influence:\n\n### **Immediate Effects**:\n- Invisibility (isolation from others)\n- Heightened senses and abilities\n- Addictive euphoria\n\n### **Long-term Corruption**:\n- Physical transformation (Gollum)\n- Moral decay (loss of empathy)\n- Obsession (nothing else matters)\n\n## Characters & Power:\n- **Boromir**: Good intentions, corrupted methods\n- **Saruman**: Wisdom perverted by desire for control\n- **Denethor**: Legitimate authority becomes tyranny\n- **Galadriel**: Rejects the Ring\'s temptation\n\n## Key Message:\n> "Even the very wise cannot see all ends."\n\n*True strength lies in rejecting power, not wielding it.*',
          date: getDateOffset(6),
          key: 'lotr-trilogy',
          tags: ['theme', 'power', 'corruption', 'temptation'],
          backgroundColor: CARD_COLORS.LIGHT_RED,
          width: 494,  // 247% of 200 (190% * 1.3)
          height: 428  // 247% of 173 (190% * 1.3)
        },
        {
          id: 'heroic-journey-card',
          title: 'The Hero\'s Journey',
          content: '# Classic Monomyth Structure\n\n## Joseph Campbell\'s Pattern:\n\n### **Act I - Departure**:\n1. **Ordinary World**: The Shire\n2. **Call to Adventure**: Gandalf\'s revelation\n3. **Refusal**: "I wish the Ring had never come to me"\n4. **Mentor**: Gandalf\'s guidance\n5. **Crossing**: Leaving the Shire\n\n### **Act II - Initiation**:\n6. **Tests**: Weathertop, Mines of Moria, Galadriel\n7. **Allies**: The Fellowship\n8. **Ordeal**: Shelob\'s tunnel, Mount Doom\n9. **Reward**: Ring\'s destruction\n\n### **Act III - Return**:\n10. **The Road Back**: Journey to Grey Havens\n11. **Transformation**: Frodo\'s change\n12. **Return with Elixir**: Peace restored\n\n*Multiple heroes\' journeys interweave throughout the trilogy.*',
          date: getDateOffset(7),
          key: 'lotr-trilogy',
          tags: ['theme', 'structure', 'monomyth', 'journey'],
          backgroundColor: CARD_COLORS.LIGHT_ORANGE,
          width: 494,  // 247% of 200 (190% * 1.3)
          height: 428  // 247% of 173 (190% * 1.3)
        },
        {
          id: 'friendship-sacrifice-card',
          title: 'Friendship & Sacrifice',
          content: '# Bonds That Define the Quest\n\n## The Fellowship\'s Bond:\n- **Mutual Support**: Each member\'s unique contribution\n- **Loyalty**: Even after the Fellowship breaks\n- **Sacrifice**: Willing to die for each other\n\n## Key Relationships:\n\n### **Frodo & Sam**:\n- Master and servant → True equals\n- Sam\'s unwavering loyalty saves the quest\n- *"I can\'t carry it for you, but I can carry you!"*\n\n### **Legolas & Gimli**:\n- Ancient enmity (Elves vs Dwarves) → Deep friendship\n- Competitive cooperation\n- Breaking racial prejudices\n\n### **Aragorn, Legolas, Gimli**:\n- The Three Hunters\n- Different backgrounds, common cause\n- Leadership through service\n\n*True friendship requires selflessness and shared sacrifice.*',
          date: getDateOffset(8),
          key: 'lotr-trilogy',
          tags: ['theme', 'friendship', 'loyalty', 'sacrifice'],
          backgroundColor: CARD_COLORS.LIGHT_PINK,
          width: 494,  // 247% of 200 (190% * 1.3)
          height: 428  // 247% of 173 (190% * 1.3)
        }
      ]
    },

    // Visual Elements Stack - Medium size (160% - 320x277)
    {
      id: 'visual-stack',
      x: 1200,
      y: 50,
      title: 'Visual Storytelling',
      cards: [
        {
          id: 'cinematography-card',
          title: 'Cinematography',
          content: '# Visual Storytelling Mastery\n\n## Peter Jackson\'s Techniques:\n\n### **Scale & Perspective**:\n- **Forced perspective**: Making hobbits appear smaller\n- **Wide shots**: Emphasizing the vastness of Middle-earth\n- **Close-ups**: Intimate character moments (Ring on Frodo\'s palm)\n\n### **Camera Movement**:\n- **Sweeping**: Helicopter shots of New Zealand landscapes\n- **Tracking**: Following characters through environments\n- **Crash zooms**: Building tension (Eye of Sauron)\n\n### **Color Grading**:\n- **Warm tones**: Shire, Rivendell (safety, home)\n- **Cold blues/grays**: Moria, Mordor (danger, death)\n- **Golden light**: Rohan (nobility, hope)\n\n### **Iconic Shots**:\n- Gandalf vs Balrog on the bridge\n- The beacon lighting sequence\n- Frodo and Sam on Mount Doom\n\n*Every frame serves the story and emotional journey.*',
          date: getDateOffset(9),
          key: 'lotr-trilogy',
          tags: ['visual', 'cinematography', 'technique'],
          backgroundColor: CARD_COLORS.LIGHT_CYAN,
          width: 416,  // 208% of 200 (160% * 1.3)
          height: 360  // 208% of 173 (160% * 1.3)
        },
        {
          id: 'music-card',
          title: 'Howard Shore\'s Score',
          content: '# Musical Themes & Motifs\n\n## Leitmotif System:\n\n### **Major Themes**:\n- **The Shire**: Pastoral, innocent (pennywhistle, strings)\n- **The Ring**: Ominous, seductive (male chorus in Black Speech)\n- **Rohan**: Heroic, noble (fiddle, Celtic influences)\n- **Gondor**: Majestic, ancient (brass, full orchestra)\n\n### **Character Themes**:\n- **Fellowship**: Unity and brotherhood\n- **Gollum**: Dissonant, tortured\n- **Arwen**: Ethereal, elvish\n\n### **Emotional Moments**:\n- **"Concerning Hobbits"**: Establishes innocence\n- **"The Bridge of Khazad-dûm"**: Gandalf\'s sacrifice\n- **"Into the West"**: Frodo\'s departure\n- **"The Return of the King"**: Triumphant finale\n\n## Innovation:\n- **Boy soprano**: Representing innocence lost\n- **Ancient languages**: Elvish, Black Speech\n- **World music influences**: Celtic, Eastern\n\n*Music as emotional architecture for the trilogy.*',
          date: getDateOffset(10),
          key: 'lotr-trilogy',
          tags: ['visual', 'music', 'score', 'emotion'],
          backgroundColor: CARD_COLORS.LIGHT_INDIGO,
          width: 416,  // 208% of 200 (160% * 1.3)
          height: 360  // 208% of 173 (160% * 1.3)
        },
        {
          id: 'production-design-card',
          title: 'Production Design',
          content: '# Creating Middle-earth\n\n## Dan Hennah & Team\'s Vision:\n\n### **Architectural Styles**:\n- **Hobbiton**: Organic, earth-integrated homes\n- **Rivendell**: Flowing, naturalistic Elven architecture\n- **Minas Tirith**: White stone, seven levels, symbolic of hope\n- **Isengard**: Industrial, mechanical, corruption of nature\n\n### **Cultural Design**:\n\n#### **The Shire**:\n- Round doors, gardens, comfortable domesticity\n- Warm colors, natural materials\n- English countryside aesthetic\n\n#### **Rohan**:\n- Horse-culture, Anglo-Saxon influenced\n- Wooden halls, Norse aesthetic\n- Practical, warrior-focused design\n\n#### **Gondor**:\n- Byzantine/medieval European influences\n- White stone, ancient grandeur\n- Architectural decay showing decline\n\n### **Symbolic Elements**:\n- **Trees**: Life, nature, wisdom (Ents, White Tree)\n- **Towers**: Power, watch, isolation\n- **Circles**: Unity, completion, cycles\n\n*Every design choice reinforces cultural identity and themes.*',
          date: getDateOffset(11),
          key: 'lotr-trilogy',
          tags: ['visual', 'design', 'architecture', 'culture'],
          backgroundColor: CARD_COLORS.LIGHT_TEAL,
          width: 416,  // 208% of 200 (160% * 1.3)
          height: 360  // 208% of 173 (160% * 1.3)
        },
        {
          id: 'special-effects-card',
          title: 'Groundbreaking Effects',
          content: '# WETA\'s Technical Innovation\n\n## Revolutionary Techniques:\n\n### **Gollum - Digital Acting**:\n- **Motion capture**: Andy Serkis\'s performance translation\n- **Facial animation**: Emotional subtlety in CGI character\n- **Integration**: Seamless interaction with live actors\n- **Breakthrough**: First fully-realized digital character\n\n### **Massive Software**:\n- **Digital armies**: Thousands of individual warriors\n- **AI behavior**: Each soldier acts independently\n- **Helm\'s Deep**: 10,000 Uruk-hai\n- **Pelennor Fields**: Unprecedented scale\n\n### **Miniatures & Bigatures**:\n- **Minas Tirith**: 7-meter tall model\n- **Barad-dûr**: Practical tower model\n- **Orthanc**: Physical construction with digital enhancement\n- **Forced perspective**: Size illusions without CGI\n\n### **Practical Effects**:\n- **Balrog**: Mix of practical fire and digital creature\n- **Explosions**: Real pyrotechnics enhanced digitally\n- **Weather**: Actual rain, snow, wind where possible\n\n## Legacy:\n- Academy Award for Technical Achievement\n- Influenced entire film industry\n- Balance of practical and digital effects\n\n*Technology serving story, not overwhelming it.*',
          date: getDateOffset(12),
          key: 'lotr-trilogy',
          tags: ['visual', 'effects', 'technology', 'innovation'],
          backgroundColor: CARD_COLORS.LIGHT_LIME,
          width: 416,  // 208% of 200 (160% * 1.3)
          height: 360  // 208% of 173 (160% * 1.3)
        }
      ]
    },

    // Plot Points Stack - Extra Large size (200% - 400x346)
    {
      id: 'plot-stack',
      x: 50,
      y: 600,
      title: 'Major Plot Points',
      cards: [
        {
          id: 'ring-discovery-card',
          title: 'The Ring Discovery',
          content: '# The Inciting Incident\n\n## Gandalf\'s Revelation:\n\n### **The Investigation**:\n- 17 years of research\n- Ancient scrolls and fire test\n- Confirmation of the Ring\'s true nature\n\n### **The Revelation Scene**:\n> "This is the One Ring, forged by the Dark Lord Sauron in the fires of Mount Doom."\n\n### **Story Function**:\n- **Point of No Return**: Peaceful Shire life ends\n- **Exposition**: Explains Ring\'s history and power\n- **Character Test**: Frodo\'s first moment of choice\n\n## Visual Elements:\n- **Fire test**: Ring reveals Black Speech inscription\n- **Gandalf\'s expression**: Horror and urgency\n- **Frodo\'s innocence**: Last moment before responsibility\n\n## Thematic Significance:\n- Knowledge brings responsibility\n- Ignorance cannot be reclaimed\n- The burden of truth\n\n*The moment everything changes for both Frodo and Middle-earth.*',
          date: getDateOffset(13),
          key: 'lotr-trilogy',
          tags: ['plot', 'revelation', 'turning-point'],
          backgroundColor: CARD_COLORS.LIGHT_AMBER,
          width: 520,  // 260% of 200 (200% * 1.3)
          height: 450  // 260% of 173 (200% * 1.3)
        },
        {
          id: 'fellowship-formation-card',
          title: 'Fellowship Formation',
          content: '# The Council of Elrond\n\n## The Gathering:\n\n### **Representatives**:\n- **Elves**: Elrond, Legolas (wisdom, immortality)\n- **Dwarves**: Gimli (strength, craftsmanship)\n- **Men**: Aragorn, Boromir (leadership, varied motivations)\n- **Hobbits**: Frodo, Sam, Merry, Pippin (innocence, loyalty)\n- **Wizard**: Gandalf (guide, power)\n\n### **The Debate**:\n1. **Options Considered**:\n   - Hide the Ring\n   - Use it as weapon\n   - Send it away\n   - Destroy it\n\n2. **Boromir\'s Temptation**:\n   - "Why not use this Ring?"\n   - First hint of corruption\'s reach\n   - Foreshadows later betrayal\n\n### **The Decision**:\n- **Frodo\'s Choice**: "I will take it"\n- **Fellowship\'s Formation**: Voluntary commitment\n- **Nine Walkers**: Counter to Nine Riders\n\n## Significance:\n- Unity of different races\n- Collective responsibility\n- Beginning of true quest\n\n*When individual courage inspires collective action.*',
          date: getDateOffset(14),
          key: 'lotr-trilogy',
          tags: ['plot', 'alliance', 'unity', 'commitment'],
          backgroundColor: CARD_COLORS.LIGHT_BROWN,
          width: 520,  // 260% of 200 (200% * 1.3)
          height: 450  // 260% of 173 (200% * 1.3)
        },
        {
          id: 'helms-deep-card',
          title: 'Battle of Helm\'s Deep',
          content: '# The Turning Point\n\n## Military Strategy:\n\n### **Tactical Elements**:\n- **Defensive Position**: Ancient fortress advantage\n- **Overwhelming Odds**: 10,000 Uruk-hai vs few hundred\n- **Siege Warfare**: Ladders, towers, explosives\n- **Last Stand**: When walls are breached\n\n### **Key Moments**:\n1. **Haldir\'s Arrival**: Elves honor ancient alliance\n2. **The Wall Breach**: Uruk with torch and explosive\n3. **Aragorn & Éomer\'s Cavalry**: Dawn charge\n4. **Gandalf\'s Return**: With Erkenbrand\'s reinforcements\n\n## Character Development:\n\n### **Aragorn**:\n- Military leadership\n- Strategic thinking\n- Inspiring others\n\n### **Legolas & Gimli**:\n- Friendly competition\n- Perfect teamwork\n- Mutual respect deepens\n\n## Thematic Significance:\n- **Hope in Despair**: "Look to my coming at first light"\n- **Alliance**: Different races fighting together\n- **Sacrifice**: Haldir\'s death, many losses\n- **Renewal**: Victory against impossible odds\n\n*When courage and friendship triumph over overwhelming darkness.*',
          date: getDateOffset(15),
          key: 'lotr-trilogy',
          tags: ['plot', 'battle', 'strategy', 'turning-point'],
          backgroundColor: CARD_COLORS.LIGHT_DEEP_ORANGE,
          width: 520,  // 260% of 200 (200% * 1.3)
          height: 450  // 260% of 173 (200% * 1.3)
        },
        {
          id: 'mount-doom-card',
          title: 'Mount Doom Climax',
          content: '# The Final Test\n\n## The Ascent:\n\n### **Physical Journey**:\n- **Sam carrying Frodo**: Ultimate loyalty\n- **Gollum\'s pursuit**: Final confrontation brewing\n- **Ring\'s weight**: Crushing burden visualization\n\n### **Psychological Journey**:\n- **Frodo\'s deterioration**: Ring\'s final assault\n- **Loss of hope**: "I can see no way out"\n- **Sam\'s encouragement**: "There\'s some good in this world"\n\n## The Climax:\n\n### **Frodo\'s Failure**:\n- Claims the Ring for himself\n- Shows Ring\'s ultimate power\n- Hero\'s human limitation\n\n### **Gollum\'s Role**:\n- Attacks Frodo for the Ring\n- Falls into lava with Ring\n- Unintentional savior of Middle-earth\n\n### **The Resolution**:\n- Ring\'s destruction\n- Sauron\'s defeat\n- Eagles\' rescue\n\n## Thematic Completion:\n- **Grace vs Merit**: Salvation comes through unexpected means\n- **Providence**: Good emerges from evil actions\n- **Humility**: Even heroes have limits\n- **Friendship**: Sam\'s love saves the day\n\n*The paradox of victory through apparent failure.*',
          date: getDateOffset(16),
          key: 'lotr-trilogy',
          tags: ['plot', 'climax', 'redemption', 'sacrifice'],
          backgroundColor: CARD_COLORS.LIGHT_BLUE_GREY,
          width: 520,  // 260% of 200 (200% * 1.3)
          height: 450  // 260% of 173 (200% * 1.3)
        }
      ]
    },

    // Literary Analysis Stack - Small size (150% - 300x260)
    {
      id: 'literary-stack',
      x: 800,
      y: 750,
      title: 'Literary Analysis',
      cards: [
        {
          id: 'tolkien-influences-card',
          title: 'Tolkien\'s Influences',
          content: '# Sources of Middle-earth\n\n## Literary Influences:\n\n### **Medieval Literature**:\n- **Beowulf**: Heroic epic structure, dragon/treasure themes\n- **Arthurian Legend**: Quest narrative, noble sacrifice\n- **Norse Mythology**: Ragnarök (end times), Valhalla concepts\n- **Finnish Kalevala**: Epic poetry, creation myths\n\n### **Classical Sources**:\n- **Homer\'s Odyssey**: Long journey home, trials\n- **Virgil\'s Aeneid**: Founding of kingdoms, destiny\n- **Germanic Myths**: Ring cycles, cursed gold\n\n## Personal Experience:\n\n### **WWI Trauma**:\n- **Battle of the Somme**: Industrial warfare horror\n- **Lost friends**: Sam Gamgee based on enlisted men\n- **Shell shock**: Frodo\'s post-quest trauma\n- **Industrialization vs Nature**: Shire vs Saruman\n\n### **Academic Background**:\n- **Philology**: Language creation (Elvish, Black Speech)\n- **Anglo-Saxon**: Cultural elements in Rohan\n- **Celtic Studies**: Elvish culture and departure\n\n## Religious Themes:\n- **Catholic Providence**: Divine plan working through events\n- **Sacrificial Love**: Sam\'s devotion, Frodo\'s burden\n- **Redemption**: Possibility even for Gollum\n\n*Personal trauma and scholarly expertise create universal themes.*',
          date: getDateOffset(17),
          key: 'tolkien',
          tags: ['analysis', 'influences', 'historical', 'academic'],
          backgroundColor: CARD_COLORS.LIGHT_LAVENDER,
          width: 390,  // 195% of 200 (150% * 1.3)
          height: 338  // 195% of 173 (150% * 1.3)
        },
        {
          id: 'mythological-elements-card',
          title: 'Mythological Framework',
          content: '# Archetypal Patterns\n\n## Joseph Campbell\'s Monomyth:\n\n### **Universal Hero Pattern**:\n- **Departure**: Leaving comfortable world\n- **Initiation**: Trials and transformation\n- **Return**: Changed hero brings wisdom\n\n## Archetypal Characters:\n\n### **The Hero**: Frodo\n- Reluctant, ordinary person called to greatness\n- Suffers transformation through trial\n- Sacrifices personal happiness for others\n\n### **The Mentor**: Gandalf\n- Wise guide who appears at crucial moments\n- Dies and returns transformed\n- Provides tools and wisdom, not solutions\n\n### **The Shadow**: Sauron/The Ring\n- Represents repressed, dark aspects\n- Corruption of power and desire\n- Must be confronted and overcome\n\n### **The Threshold Guardian**: Various\n- Weathertop Nazgûl, Balrog, Gollum\n- Test hero\'s commitment\n- Often become allies later\n\n## Mythic Themes:\n- **Death and Rebirth**: Gandalf, Frodo\'s spiritual death\n- **The Wasteland**: Mordor, restoration through sacrifice\n- **The Fisher King**: Denethor\'s madness, Aragorn\'s healing\n\n*Timeless patterns speak to human unconscious.*',
          date: getDateOffset(18),
          key: 'lotr-trilogy',
          tags: ['analysis', 'mythology', 'archetypes', 'universal'],
          backgroundColor: CARD_COLORS.LIGHT_MINT,
          width: 390,  // 195% of 200 (150% * 1.3)
          height: 338  // 195% of 173 (150% * 1.3)
        },
        {
          id: 'symbolism-card',
          title: 'Symbolic Elements',
          content: '# Layers of Meaning\n\n## The Ring as Symbol:\n\n### **Power Corruption**:\n- Absolute power corrupts absolutely\n- Invisibility = isolation from humanity\n- Addiction = modern substance abuse parallels\n\n### **Technology & Progress**:\n- Industrial power vs natural world\n- Saruman\'s machines vs Ent\'s trees\n- Modern warfare vs traditional values\n\n## Geographic Symbolism:\n\n### **The Shire**:\n- **Eden/Paradise**: Innocence, natural harmony\n- **England**: Tolkien\'s idealized rural past\n- **Home**: What we fight to preserve\n\n### **Mordor**:\n- **Hell/Wasteland**: Spiritual desolation\n- **Industrialization**: Pollution, mechanization\n- **Evil**: Absolute corruption of nature\n\n### **Rivendell/Lothlórien**:\n- **Sanctuary**: Temporary refuge\n- **Wisdom**: Ancient knowledge preserved\n- **Fading**: Beautiful things must pass\n\n## Color Symbolism:\n- **White**: Purity, wisdom, hope (Gandalf, Gondor)\n- **Gold**: Corruption, temptation (Ring, Smaug\'s hoard)\n- **Green**: Nature, life, growth (Shire, Ents)\n- **Black**: Evil, death, despair (Nazgûl, Mordor)\n\n## Tree Symbolism:\n- **White Tree**: Gondor\'s hope and renewal\n- **Ents**: Nature\'s wisdom and power\n- **Old Forest**: Ancient, wild nature\n\n*Multiple interpretative layers enrich the narrative.*',
          date: getDateOffset(19),
          key: 'lotr-trilogy',
          tags: ['analysis', 'symbolism', 'interpretation', 'meaning'],
          backgroundColor: CARD_COLORS.LIGHT_PEACH,
          width: 390,  // 195% of 200 (150% * 1.3)
          height: 338  // 195% of 173 (150% * 1.3)
        }
      ]
    }
  ];

  const connections: ConnectionData[] = [
    // Characters to Themes
    { id: 'conn-1', from: 'characters-stack', to: 'themes-stack', label: 'Embody Themes' },
    // Plot Points to Characters  
    { id: 'conn-2', from: 'plot-stack', to: 'characters-stack', label: 'Character Development' },
    // Visual Elements to Themes
    { id: 'conn-3', from: 'visual-stack', to: 'themes-stack', label: 'Visual Reinforcement' },
    // Literary Analysis to all others
    { id: 'conn-4', from: 'literary-stack', to: 'characters-stack', label: 'Archetypal Analysis' },
    { id: 'conn-5', from: 'literary-stack', to: 'themes-stack', label: 'Thematic Depth' },
    { id: 'conn-6', from: 'literary-stack', to: 'visual-stack', label: 'Symbolic Visual Language' },
    { id: 'conn-7', from: 'literary-stack', to: 'plot-stack', label: 'Mythic Structure' }
  ];

  return { stacks, connections };
};