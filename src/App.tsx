import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import EditableTextOverlay from './components/EditableTextOverlay'; // Import new component
import ColorPicker from './components/ColorPicker';
import MarkdownRenderer from './components/MarkdownRenderer';
import ConfirmDialog from './components/ConfirmDialog';
import { NotecardData, StackData, ConnectionData, WorkspaceData, CARD_COLORS, SearchFilters, SearchResult } from './types';
import { CARD_WIDTH, CARD_HEIGHT } from './constants/typography';
import { LAYOUT } from './constants/layout';
import Konva from 'konva'; // Import Konva for Node type

// Data migration utility for backward compatibility
const migrateWorkspaceData = (data: any): WorkspaceData => {
  // Migrate NotecardData fields
  const migrateCard = (card: any): NotecardData => ({
    ...card,
    date: card.date || new Date().toISOString(), // Default to current date if missing
    backgroundColor: card.backgroundColor || CARD_COLORS.DEFAULT,
    tags: card.tags || [],
    key: card.key || undefined,
  });

  // Migrate ConnectionData fields  
  const migrateConnection = (connection: any): ConnectionData => ({
    ...connection,
    label: connection.label || undefined,
  });

  return {
    ...data,
    stacks: data.stacks?.map((stack: any) => ({
      ...stack,
      cards: stack.cards?.map(migrateCard) || [],
    })) || [],
    connections: data.connections?.map(migrateConnection) || [],
  };
};

// Generate demo data for Lord of the Rings movie analysis
const generateMovieDemoData = (): { stacks: StackData[], connections: ConnectionData[] } => {
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
      y: 600,
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

const TITLE_PADDING = 10;
const CONTENT_PADDING_TOP = 35;

function App() {
  const [stacks, setStacks] = useState<StackData[]>([
    {
      id: 'stack-1',
      x: 50,
      y: 50,
      cards: [
        { 
          id: 'card-1', 
          title: 'Welcome!', 
          content: 'This is the bottom card',
          date: new Date().toISOString(),
          backgroundColor: CARD_COLORS.DEFAULT
        },
        { 
          id: 'card-2', 
          title: 'Top Card', 
          content: '# Hello World\n\nThis is a **markdown** card with:\n\n- Bullet points\n- *Italic text*\n- `code snippets`\n\n> A blockquote example',
          date: new Date().toISOString(),
          backgroundColor: CARD_COLORS.LIGHT_BLUE
        },
      ],
    },
  ]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<{ fromStackId: string; toX: number; toY: number } | null>(null);

  // State for file management
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for card editing
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'content' | 'date' | 'key' | 'tags' | 'stack-title' | null>(null);
  const [editingKonvaNode, setEditingKonvaNode] = useState<Konva.Node | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>('');

  // State for stack editing
  const [editingStackId, setEditingStackId] = useState<string | null>(null);

  // State for connection editing
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null);

  // State for color picker
  const [colorPickerCardId, setColorPickerCardId] = useState<string | null>(null);
  const [colorPickerPosition, setColorPickerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // State for delete confirmation dialog
  const [deleteConfirmCardId, setDeleteConfirmCardId] = useState<string | null>(null);
  const [deleteConfirmPosition, setDeleteConfirmPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // State for search and filtering
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchText: '',
    selectedTags: [],
    focusedKey: undefined
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [highlightedCardIds, setHighlightedCardIds] = useState<Set<string>>(new Set());

  // State for timeline
  const [isTimelineVisible, setIsTimelineVisible] = useState<boolean>(false);

  // Define ViewSettings interface for dual zoom/translation settings
  interface ViewSettings {
    scale: number;
    x: number;
    y: number;
  }

  // State for canvas zoom and focus mode with dual settings
  const [canvasZoom, setCanvasZoom] = useState<number>(1); // 1 = 100%
  const [canvasTranslate, setCanvasTranslate] = useState<{x: number; y: number}>({x: 0, y: 0});
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState<boolean>(false);
  
  // Dual view settings - separate for normal and focus modes
  const [normalViewSettings, setNormalViewSettings] = useState<ViewSettings>({
    scale: 1,
    x: 0,
    y: 0
  });
  const [focusViewSettings, setFocusViewSettings] = useState<ViewSettings>({
    scale: 1,
    x: 0,
    y: 0
  });

  // Zoom handlers that update appropriate settings based on mode
  const handleZoomIn = () => {
    const newZoom = Math.min(canvasZoom + 0.1, 2); // Max 200%
    setCanvasZoom(newZoom);
    
    if (isFocusModeEnabled) {
      // Update focus view settings
      setFocusViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    } else {
      // Update normal view settings
      setNormalViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    }
    setHasUnsavedChanges(false); // Zoom doesn't mark as unsaved
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(canvasZoom - 0.1, 0.5); // Min 50%
    setCanvasZoom(newZoom);
    
    if (isFocusModeEnabled) {
      // Update focus view settings
      setFocusViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    } else {
      // Update normal view settings
      setNormalViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    }
    setHasUnsavedChanges(false); // Zoom doesn't mark as unsaved
  };


  const handleFocusToggle = () => {
    if (isFocusModeEnabled) {
      // Turn off focus mode - restore normal view settings
      setCanvasZoom(normalViewSettings.scale);
      setCanvasTranslate({x: normalViewSettings.x, y: normalViewSettings.y});
      setIsFocusModeEnabled(false);
    } else {
      // Save current normal view settings before switching to focus mode
      setNormalViewSettings({
        scale: canvasZoom,
        x: canvasTranslate.x,
        y: canvasTranslate.y
      });
      
      // Turn on focus mode - calculate and apply focus transform
      const { zoom, translate } = calculateFocusTransform();
      setCanvasZoom(zoom);
      setCanvasTranslate(translate);
      
      // Save the focus view settings
      setFocusViewSettings({
        scale: zoom,
        x: translate.x,
        y: translate.y
      });
      
      setIsFocusModeEnabled(true);
    }
    setHasUnsavedChanges(false); // Focus mode changes don't mark as unsaved
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not editing text
      if (editingCardId || editingConnectionId) {
        if (e.key === 'Escape') {
          // Cancel editing
          setEditingCardId(null);
          setEditingField(null);
          setEditingKonvaNode(null);
          setEditingConnectionId(null);
        }
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            newWorkspace();
            break;
          case 'o':
            e.preventDefault();
            loadWorkspace();
            break;
          case 's':
            e.preventDefault();
            if (e.shiftKey) {
              saveWorkspace(); // Save As
            } else {
              saveWorkspace(currentFilePath ?? undefined); // Save
            }
            break;
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
        }
      } else {
        // Non-modifier key shortcuts
        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            handleFocusToggle();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingCardId, editingConnectionId, currentFilePath]);

  // Search and filtering functions
  const performSearch = useCallback((filters: SearchFilters): SearchResult[] => {
    const results: SearchResult[] = [];
    const { searchText, selectedTags, focusedKey } = filters;
    
    stacks.forEach(stack => {
      stack.cards.forEach(card => {
        // Search text matching
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          
          // Title match
          if (card.title.toLowerCase().includes(searchLower)) {
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'title',
              matchText: card.title
            });
          }
          
          // Content match
          if (card.content.toLowerCase().includes(searchLower)) {
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'content',
              matchText: card.content.substring(0, 100) + '...'
            });
          }
          
          // Tags match
          if (card.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
            const matchingTags = card.tags.filter(tag => tag.toLowerCase().includes(searchLower));
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'tags',
              matchText: matchingTags.join(', ')
            });
          }
          
          // Key match
          if (card.key?.toLowerCase().includes(searchLower)) {
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'key',
              matchText: card.key
            });
          }
        }
      });
    });
    
    return results;
  }, [stacks]);

  const getFilteredStacks = useCallback((): StackData[] => {
    const { searchText, selectedTags, focusedKey } = searchFilters;
    
    // If no filters are active, return all stacks
    if (!searchText.trim() && selectedTags.length === 0 && !focusedKey) {
      return stacks;
    }
    
    return stacks.map(stack => ({
      ...stack,
      cards: stack.cards.filter(card => {
        // Text search filter
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          const matchesText = 
            card.title.toLowerCase().includes(searchLower) ||
            card.content.toLowerCase().includes(searchLower) ||
            card.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
            card.key?.toLowerCase().includes(searchLower);
          
          if (!matchesText) return false;
        }
        
        // Tag filter (AND logic)
        if (selectedTags.length > 0) {
          const cardTags = card.tags || [];
          const hasAllTags = selectedTags.every(tag => 
            cardTags.some(cardTag => cardTag.toLowerCase() === tag.toLowerCase())
          );
          if (!hasAllTags) return false;
        }
        
        // Key filter
        if (focusedKey && card.key?.toLowerCase() !== focusedKey.toLowerCase()) {
          return false;
        }
        
        return true;
      })
    })).filter(stack => stack.cards.length > 0); // Remove empty stacks
  }, [stacks, searchFilters]);

  const getAllTags = useCallback((): string[] => {
    const tagSet = new Set<string>();
    stacks.forEach(stack => {
      stack.cards.forEach(card => {
        if (card.tags) {
          card.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
        }
      });
    });
    return Array.from(tagSet).sort();
  }, [stacks]);

  const getAllKeys = useCallback((): string[] => {
    const keySet = new Set<string>();
    stacks.forEach(stack => {
      stack.cards.forEach(card => {
        if (card.key) {
          keySet.add(card.key.toLowerCase());
        }
      });
    });
    return Array.from(keySet).sort();
  }, [stacks]);

  // Extracted focus calculation logic
  const calculateFocusTransform = useCallback(() => {
    const filteredStacks = getFilteredStacks();
    console.log('Focus mode: filteredStacks', filteredStacks.length);
    if (filteredStacks.length === 0) {
      // No cards to focus on, just reset
      console.log('No filtered stacks, resetting to default');
      return { zoom: 1, translate: { x: 0, y: 0 } };
    }

    // Calculate bounding box of all visible cards
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const SIDEBAR_WIDTH = LAYOUT.SIDEBAR_WIDTH;
    const CANVAS_MARGIN = 50; // Margin around focused area
    
    filteredStacks.forEach(stack => {
      if (stack.cards && stack.cards.length > 0) {
        const topCard = stack.cards[stack.cards.length - 1]; // Most visible card
        const cardWidth = topCard.width || CARD_WIDTH;
        const cardHeight = topCard.height || CARD_HEIGHT;
        
        // Calculate stack bounds (similar to getStackCenterPosition)
        const borderPadding = 10;
        const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
        const cardIndex = stack.cards.length - 1;
        const HEADER_OFFSET = 40;
        
        const xOffset = borderPadding;
        const yOffset = borderPadding + headerTextSpace + cardIndex * HEADER_OFFSET;
        
        const stackLeft = stack.x + xOffset;
        const stackTop = stack.y + yOffset;
        const stackRight = stackLeft + cardWidth;
        const stackBottom = stackTop + cardHeight;
        
        minX = Math.min(minX, stackLeft);
        minY = Math.min(minY, stackTop);
        maxX = Math.max(maxX, stackRight);
        maxY = Math.max(maxY, stackBottom);
      }
    });
    
    // Calculate canvas dimensions (excluding sidebar)
    const canvasWidth = window.innerWidth - SIDEBAR_WIDTH;
    const canvasHeight = window.innerHeight;
    
    // Calculate content dimensions
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    console.log('Content bounds:', {minX, minY, maxX, maxY, contentWidth, contentHeight});
    console.log('Canvas dimensions:', {canvasWidth, canvasHeight});
    
    // Calculate scale to fit content with margin
    const scaleX = (canvasWidth - CANVAS_MARGIN * 2) / contentWidth;
    const scaleY = (canvasHeight - CANVAS_MARGIN * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Max 200% zoom
    
    // Calculate translation to center content
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const translateX = (canvasWidth / 2) / scale - centerX;
    const translateY = (canvasHeight / 2) / scale - centerY;
    
    console.log('Focus calculations:', {scale, centerX, centerY, translateX, translateY});
    
    return { zoom: scale, translate: { x: translateX, y: translateY } };
  }, [stacks, searchFilters]);

  // Update search results when filters or stacks change
  useEffect(() => {
    const results = performSearch(searchFilters);
    setSearchResults(results);
    setHighlightedCardIds(new Set(results.map(r => r.cardId)));
  }, [searchFilters, performSearch]);

  // Auto-update focus transform when filters change and focus mode is enabled
  useEffect(() => {
    if (isFocusModeEnabled) {
      console.log('Focus mode is enabled, recalculating transform due to filter change');
      const { zoom, translate } = calculateFocusTransform();
      setCanvasZoom(zoom);
      setCanvasTranslate(translate);
      
      // Update focus view settings with new calculated values
      setFocusViewSettings({
        scale: zoom,
        x: translate.x,
        y: translate.y
      });
    }
  }, [searchFilters, stacks, isFocusModeEnabled, calculateFocusTransform]);

  const handleSearchChange = (searchText: string) => {
    setSearchFilters(prev => ({ ...prev, searchText }));
  };

  const handleTagFilterChange = (tags: string[]) => {
    setSearchFilters(prev => ({ ...prev, selectedTags: tags }));
  };

  const handleKeyFilterChange = (key?: string) => {
    setSearchFilters(prev => ({ ...prev, focusedKey: key }));
  };

  // Timeline toggle handler
  const handleTimelineToggle = () => {
    setIsTimelineVisible(prev => !prev);
  };

  // Timeline card interaction handlers
  const handleTimelineCardClick = (cardId: string) => {
    // Highlight the clicked card
    setHighlightedCardIds(new Set([cardId]));
  };

  const handleTimelineCardHover = (cardId: string | null) => {
    if (cardId) {
      setHighlightedCardIds(new Set([cardId]));
    } else {
      setHighlightedCardIds(new Set());
    }
  };

  // Auto-load last opened file on startup
  useEffect(() => {
    const autoLoadLastFile = async () => {
      try {
        const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
        if (!ipcRenderer) return;

        const lastFilePath = await ipcRenderer.invoke('get-last-opened-file');
        if (lastFilePath) {
          try {
            const fileResult = await ipcRenderer.invoke('load-file', lastFilePath);
            if (fileResult.success && fileResult.data) {
              const rawData = JSON.parse(fileResult.data);
              const workspaceData = migrateWorkspaceData(rawData);
              
              // Clear default welcome card when loading a workspace
              setStacks(workspaceData.stacks);
              setConnections(workspaceData.connections);
              setCurrentFilePath(lastFilePath);
              setHasUnsavedChanges(false);
              
              console.log('Auto-loaded workspace:', lastFilePath);
            } else {
              console.log('Failed to auto-load workspace:', fileResult.error);
              // Keep the default welcome card if auto-load fails
            }
          } catch (error) {
            console.log('Error parsing workspace file:', error);
            // Keep the default welcome card if file is corrupted
          }
        } else {
          console.log('No previous workspace to auto-load');
          // Keep the default welcome card for new users
        }
      } catch (error) {
        console.log('Auto-load not available:', error);
      }
    };

    autoLoadLastFile();
  }, []);

  // Workspace save/load functions
  const saveWorkspace = async (filePath?: string | null) => {
    try {
      // Check if we're in Electron environment
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      
      if (!ipcRenderer) {
        alert('File operations not available - running in browser mode');
        return;
      }

      let targetPath: string | undefined = filePath ?? undefined;
      
      if (!targetPath) {
        const result = await ipcRenderer.invoke('save-workspace-dialog');
        if (result.canceled) return;
        targetPath = result.filePath;
      }

      if (!targetPath) {
        alert('No file path specified');
        return;
      }

      const workspaceData: WorkspaceData = {
        version: '1.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        stacks,
        connections,
      };

      const result = await ipcRenderer.invoke('save-file', targetPath, JSON.stringify(workspaceData, null, 2));
      
      if (result.success) {
        setCurrentFilePath(targetPath || null);
        setHasUnsavedChanges(false);
        // Record as last opened file
        await ipcRenderer.invoke('set-last-opened-file', targetPath);
        alert('Workspace saved successfully!');
      } else {
        alert(`Failed to save workspace: ${result.error}`);
      }
    } catch (error) {
      alert(`Error saving workspace: ${error}`);
    }
  };

  const loadWorkspace = async () => {
    try {
      // Check if we're in Electron environment
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      
      if (!ipcRenderer) {
        alert('File operations not available - running in browser mode');
        return;
      }

      const result = await ipcRenderer.invoke('open-workspace-dialog');
      if (result.canceled) return;

      const filePath = result.filePaths[0];
      if (!filePath) {
        alert('No file selected');
        return;
      }

      const fileResult = await ipcRenderer.invoke('load-file', filePath);
      
      if (fileResult.success && fileResult.data) {
        const rawData = JSON.parse(fileResult.data);
        const workspaceData = migrateWorkspaceData(rawData);
        
        setStacks(workspaceData.stacks);
        setConnections(workspaceData.connections);
        setCurrentFilePath(filePath);
        setHasUnsavedChanges(false);
        
        // Note: Last opened file is already recorded by the main process load-file handler
        alert('Workspace loaded successfully!');
      } else {
        alert(`Failed to load workspace: ${fileResult.error}`);
      }
    } catch (error) {
      alert(`Error loading workspace: ${error}`);
    }
  };

  const newWorkspace = () => {
    if (hasUnsavedChanges) {
      const save = confirm('You have unsaved changes. Save before creating a new workspace?');
      if (save) {
        saveWorkspace();
        return;
      }
    }
    
    setStacks([]);
    setConnections([]);
    setCurrentFilePath(null);
    setHasUnsavedChanges(false);
  };

  const handleCreateCard = (cardData?: Partial<NotecardData>) => {
    const newCard: NotecardData = {
      id: `card-${Date.now()}`,
      title: cardData?.title || 'New Card',
      content: cardData?.content || 'This is a new notecard.',
      date: new Date().toISOString(),
      backgroundColor: cardData?.backgroundColor || CARD_COLORS.DEFAULT,
      tags: cardData?.tags,
      key: cardData?.key,
      width: cardData?.width,
      height: cardData?.height,
    };
    const newStack: StackData = {
      id: `stack-${Date.now()}`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      cards: [newCard],
    };
    setStacks([...stacks, newStack]);
    setHasUnsavedChanges(true);
  };

  const handleLoadDemo = () => {
    const demoData = generateMovieDemoData();
    setStacks(demoData.stacks);
    setConnections(demoData.connections);
    setCurrentFilePath('Lord of the Rings Movie Analysis Demo.cardstaxx');
    setHasUnsavedChanges(true);
  };

  const handleStackDragMove = (id: string, x: number, y: number) => {
    setStacks(
      stacks.map((stack) => {
        if (stack.id === id) {
          return { ...stack, x, y };
        }
        return stack;
      })
    );
  };

  const handleStackDragEnd = (draggedStackId: string, x: number, y: number, mouseX?: number, mouseY?: number) => {
    const draggedStack = stacks.find((s) => s.id === draggedStackId);
    if (!draggedStack) return;

    // Use mouse position for collision detection if provided, otherwise fall back to stack position
    const checkX = mouseX !== undefined ? mouseX : x;
    const checkY = mouseY !== undefined ? mouseY : y;

    const targetStack = stacks.find(stack => {
      if (stack.id === draggedStackId) return false;
      
      // Calculate the visual bounds of the target stack (same as Stack component)
      const topCard = stack.cards[0];
      const baseCardWidth = topCard?.width || CARD_WIDTH;
      const baseCardHeight = topCard?.height || CARD_HEIGHT;
      const borderPadding = 10;
      const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
      const HEADER_OFFSET = 40;
      
      const stackWidth = baseCardWidth + borderPadding * 2;
      const stackHeight = baseCardHeight + (stack.cards.length - 1) * HEADER_OFFSET + borderPadding * 2 + headerTextSpace;
      
      // Check if mouse position is within the target stack's visual boundaries
      return (
        checkX >= stack.x &&
        checkX <= stack.x + stackWidth &&
        checkY >= stack.y &&
        checkY <= stack.y + stackHeight
      );
    });

    if (targetStack) {
      // Get dimensions for size adoption logic
      const targetTopCard = targetStack.cards[0];
      const targetWidth = targetTopCard?.width || CARD_WIDTH;
      const targetHeight = targetTopCard?.height || CARD_HEIGHT;
      
      const draggedTopCard = draggedStack.cards[0];
      const draggedWidth = draggedTopCard?.width || CARD_WIDTH;
      const draggedHeight = draggedTopCard?.height || CARD_HEIGHT;
      
      // Determine final size: use larger dimensions
      const finalWidth = Math.max(targetWidth, draggedWidth);
      const finalHeight = Math.max(targetHeight, draggedHeight);
      
      const newStacks = stacks
        .map(s => {
          if (s.id === targetStack.id) {
            // Resize all cards in target stack to match final size
            const resizedTargetCards = s.cards.map(card => ({
              ...card,
              width: finalWidth,
              height: finalHeight
            }));
            
            // Resize dragged cards to match final size
            const resizedDraggedCards = draggedStack.cards.map(card => ({
              ...card,
              width: finalWidth,
              height: finalHeight
            }));
            
            return { 
              ...s, 
              cards: [...resizedTargetCards, ...resizedDraggedCards] 
            };
          }
          return s;
        })
        .filter(s => s.id !== draggedStackId);
      setStacks(newStacks);
      setHasUnsavedChanges(true);
    } else {
      setStacks(
        stacks.map((stack) => {
          if (stack.id === draggedStackId) {
            return { ...stack, x, y };
          }
          return stack;
        })
      );
      setHasUnsavedChanges(true);
    }
  };

  const handleStackWheel = (stackId: string, deltaY: number) => {
    // Direct scroll handling without throttling for maximum responsiveness
    setStacks(
      stacks.map(stack => {
        if (stack.id === stackId && stack.cards.length > 1) {
          const newCards = [...stack.cards];
          if (deltaY > 0) {
            const topCard = newCards.shift();
            if (topCard) newCards.push(topCard);
          } else {
            const bottomCard = newCards.pop();
            if (bottomCard) newCards.unshift(bottomCard);
          }
          return { ...stack, cards: newCards };
        }
        return stack;
      })
    );
  };

  const handleConnectionDragStart = (fromStackId: string, startX: number, startY: number) => {
    setIsConnecting(true);
    setCurrentConnection({ fromStackId, toX: startX, toY: startY });
  };

  const handleConnectionDragMove = (currentX: number, currentY: number) => {
    if (currentConnection) {
      setCurrentConnection({ ...currentConnection, toX: currentX, toY: currentY });
    }
  };

  const handleConnectionDragEnd = (endX: number, endY: number) => {
    console.log('--- handleConnectionDragEnd ---');
    console.log('Dropped at:', { endX, endY });
    if (currentConnection) {
      console.log('From Stack ID:', currentConnection.fromStackId);
      const targetStack = stacks.find(stack => {
        if (stack.id === currentConnection.fromStackId) {
          console.log('Skipping source stack:', stack.id);
          return false;
        }

        const topCard = stack.cards[0];
        const stackWidth = topCard?.width || CARD_WIDTH;
        const stackHeight = (topCard?.height || CARD_HEIGHT) + (stack.cards.length - 1) * 40; // Assuming HEADER_OFFSET is 40
        const collision = (
          endX > stack.x &&
          endX < stack.x + stackWidth &&
          endY > stack.y &&
          endY < stack.y + stackHeight
        );
        console.log(`Checking stack ${stack.id} at (${stack.x}, ${stack.y}) with size (${stackWidth}, ${stackHeight}). Collision: ${collision}`);
        return collision;
      });

      if (targetStack) {
        console.log('Target Stack Found:', targetStack.id);
        
        // Check if connection already exists (in either direction)
        const existingConnection = connections.find(conn => 
          (conn.from === currentConnection.fromStackId && conn.to === targetStack.id) ||
          (conn.from === targetStack.id && conn.to === currentConnection.fromStackId)
        );
        
        if (existingConnection) {
          console.log('Connection already exists between these stacks:', existingConnection);
        } else {
          const newConnection: ConnectionData = {
            id: `conn-${Date.now()}`,
            from: currentConnection.fromStackId,
            to: targetStack.id,
          };
          setConnections([...connections, newConnection]);
          setHasUnsavedChanges(true);
          console.log('Connection created:', newConnection);
        }
      } else {
        console.log('No target stack found at drop point.');
      }
    }
    setIsConnecting(false);
    setCurrentConnection(null);
    console.log('--- End handleConnectionDragEnd ---');
  };

  const handleConnectionLabelEdit = (connectionId: string, konvaNode: Konva.Node) => {
    setEditingConnectionId(connectionId);
    
    // Find the connection and set up editing
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      setEditingTextValue(connection.label || '');
      setEditingKonvaNode(konvaNode);
    }
  };

  const handleConnectionDelete = (connectionId: string) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
    // Clear editing state when connection is deleted
    setEditingConnectionId(null);
    setEditingKonvaNode(null);
    setEditingTextValue('');
    setHasUnsavedChanges(true);
  };

  const handleConnectionUpdate = (connectionId: string, label: string) => {
    setConnections(prevConnections => 
      prevConnections.map(conn => 
        conn.id === connectionId ? { ...conn, label: label.trim() || undefined } : conn
      )
    );
    setHasUnsavedChanges(true);
    setEditingConnectionId(null);
  };

  const handleUpdateCard = (cardId: string, updates: Partial<NotecardData>) => {
    setStacks(
      stacks.map(stack => ({
        ...stack,
        cards: stack.cards.map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }))
    );
    setHasUnsavedChanges(true);
  };

  const handleUpdateStack = (stackId: string, updates: Partial<StackData>) => {
    setStacks(
      stacks.map(stack =>
        stack.id === stackId ? { ...stack, ...updates } : stack
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleCardResize = (cardId: string, newWidth: number, newHeight: number) => {
    setStacks(
      stacks.map(stack => {
        // Check if this stack contains the card being resized
        const hasCard = stack.cards.some(card => card.id === cardId);
        
        if (hasCard) {
          // If this stack contains the card, resize ALL cards in the stack
          return {
            ...stack,
            cards: stack.cards.map(card => ({
              ...card,
              width: newWidth,
              height: newHeight
            }))
          };
        }
        
        // Otherwise, leave the stack unchanged
        return stack;
      })
    );
    setHasUnsavedChanges(true);
  };


  const handleEditStart = useCallback((cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => {
    console.log('handleEditStart received field:', field);
    setEditingCardId(cardId);
    setEditingField(field);
    setEditingKonvaNode(konvaNode);

    const card = stacks.flatMap(s => s.cards).find(c => c.id === cardId);
    if (card) {
      let value = '';
      switch (field) {
        case 'title':
          value = card.title;
          break;
        case 'content':
          value = card.content;
          break;
        case 'date':
          value = card.date ? new Date(card.date).toISOString().split('T')[0] : '';
          break;
        case 'key':
          value = card.key || '';
          break;
        case 'tags':
          value = card.tags ? card.tags.join(', ') : '';
          break;
        default:
          value = '';
      }
      setEditingTextValue(value);
    }
  }, [setEditingCardId, setEditingField, setEditingKonvaNode, stacks, setEditingTextValue]);

  const handleStackTitleEditStart = useCallback((stackId: string, konvaNode: Konva.Node) => {
    console.log('handleStackTitleEditStart called for stack:', stackId);
    setEditingStackId(stackId);
    setEditingField('stack-title');
    setEditingKonvaNode(konvaNode);

    const stack = stacks.find(s => s.id === stackId);
    if (stack) {
      setEditingTextValue(stack.title || '');
    }
  }, [setEditingStackId, setEditingField, setEditingKonvaNode, stacks, setEditingTextValue]);

  const handleColorChange = (cardId: string, newColor: string) => {
    handleUpdateCard(cardId, { backgroundColor: newColor });
    setColorPickerCardId(null); // Close color picker after selection
  };

  const handleColorPickerOpen = (cardId: string, x: number, y: number) => {
    setColorPickerCardId(cardId);
    setColorPickerPosition({ x, y });
  };

  const handleColorPickerClose = () => {
    setColorPickerCardId(null);
  };

  const handleCardDeleteRequest = (cardId: string, x: number, y: number) => {
    setDeleteConfirmCardId(cardId);
    setDeleteConfirmPosition({ x, y });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmCardId) {
      // Find and remove the card from its stack, tracking which stacks get deleted
      let deletedStackIds: string[] = [];
      
      setStacks(prevStacks => {
        const originalStackIds = new Set(prevStacks.map(s => s.id));
        
        const updatedStacks = prevStacks.map(stack => {
          // Check if this stack contains the card to delete
          const cardIndex = stack.cards.findIndex(card => card.id === deleteConfirmCardId);
          
          if (cardIndex !== -1) {
            // Remove the card from the stack
            const updatedCards = stack.cards.filter(card => card.id !== deleteConfirmCardId);
            
            // Return updated stack with remaining cards
            return {
              ...stack,
              cards: updatedCards
            };
          }
          
          return stack;
        }).filter(stack => stack.cards.length > 0); // Remove empty stacks
        
        // Track which stacks were deleted
        const remainingStackIds = new Set(updatedStacks.map(s => s.id));
        deletedStackIds = Array.from(originalStackIds).filter(id => !remainingStackIds.has(id));
        
        return updatedStacks;
      });
      
      // Clean up connections that reference deleted stacks
      if (deletedStackIds.length > 0) {
        setConnections(prevConnections => 
          prevConnections.filter(conn => 
            !deletedStackIds.includes(conn.from) && !deletedStackIds.includes(conn.to)
          )
        );
      }
      
      setHasUnsavedChanges(true);
    }
    
    setDeleteConfirmCardId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmCardId(null);
  };

  const handleEditBlur = () => {
    if (editingCardId && editingField) {
      const currentCard = stacks.flatMap(s => s.cards).find(c => c.id === editingCardId);
      if (currentCard) {
        const newValue = editingTextValue.trim();
        let updates: Partial<NotecardData> = {};
        let hasChanged = false;

        switch (editingField) {
          case 'title':
            if (newValue !== currentCard.title) {
              updates.title = newValue;
              hasChanged = true;
            }
            break;
          case 'content':
            if (newValue !== currentCard.content) {
              updates.content = newValue;
              hasChanged = true;
            }
            break;
          case 'date':
            const newDate = newValue ? new Date(newValue).toISOString() : new Date().toISOString();
            if (newDate !== currentCard.date) {
              updates.date = newDate;
              hasChanged = true;
            }
            break;
          case 'key':
            if (newValue !== (currentCard.key || '')) {
              updates.key = newValue || undefined;
              hasChanged = true;
            }
            break;
          case 'tags':
            const newTags = newValue ? newValue.split(',').map(tag => tag.trim()).filter(Boolean) : undefined;
            const currentTags = currentCard.tags || [];
            const tagsChanged = JSON.stringify(newTags || []) !== JSON.stringify(currentTags);
            if (tagsChanged) {
              updates.tags = newTags;
              hasChanged = true;
            }
            break;
        }

        if (hasChanged) {
          handleUpdateCard(editingCardId, updates);
        }
      }
    } else if (editingConnectionId) {
      // Handle connection label editing
      handleConnectionUpdate(editingConnectionId, editingTextValue);
    } else if (editingStackId && editingField === 'stack-title') {
      // Handle stack title editing
      const currentStack = stacks.find(s => s.id === editingStackId);
      if (currentStack && editingTextValue !== (currentStack.title || '')) {
        handleUpdateStack(editingStackId, { title: editingTextValue });
      }
    }
    
    setEditingCardId(null);
    setEditingField(null);
    setEditingStackId(null);
    setEditingConnectionId(null);
    setEditingKonvaNode(null);
    setEditingTextValue('');
  };

  const getOverlayPosition = () => {
    // Handle MarkdownRenderer-triggered editing
    if (!editingKonvaNode && editingCardId && editingField === 'content') {
      // Find the card position from cardPositions
      const cardPos = cardPositions.find(pos => pos.card.id === editingCardId);
      if (cardPos) {
        // Use the same positioning logic as MarkdownRenderer
        const CONTENT_PADDING_TOP = 35;
        let baseContentY = CONTENT_PADDING_TOP;
        if (cardPos.card.date) baseContentY = Math.max(baseContentY, 56);
        baseContentY = Math.max(baseContentY, cardPos.card.date ? 82 : 64);
        const TITLE_PADDING = 10;
        
        return {
          x: cardPos.x + TITLE_PADDING * cardPos.scale,
          y: cardPos.y + baseContentY * cardPos.scale,
          width: cardPos.width - TITLE_PADDING * 2 * cardPos.scale,
          height: cardPos.height - baseContentY * cardPos.scale - 40 * cardPos.scale,
        };
      }
    }
    
    if (!editingKonvaNode) return { x: 0, y: 0, width: 0, height: 0 };

    const stage = editingKonvaNode.getStage();
    if (!stage) return { x: 0, y: 0, width: 0, height: 0 };

    const stageRect = stage.container().getBoundingClientRect();
    const nodeAbsolutePosition = editingKonvaNode.getAbsolutePosition();

    // Handle connection editing separately
    if (editingConnectionId) {
      const labelText = editingTextValue || 'Label';
      const minWidth = Math.max(labelText.length * 8 + 16, 80); // Minimum 80px width
      
      const calculatedPos = {
        x: stageRect.left + nodeAbsolutePosition.x - minWidth / 2,
        y: stageRect.top + nodeAbsolutePosition.y - 9,
        width: minWidth,
        height: 18,
      };
      console.log('Connection Overlay Position:', calculatedPos);
      return calculatedPos;
    }

    // Handle stack title editing
    if (editingField === 'stack-title') {
      const stackTitlePos = {
        x: stageRect.left + nodeAbsolutePosition.x,
        y: stageRect.top + nodeAbsolutePosition.y,
        width: Math.max(120, editingKonvaNode.width() || 120), // Minimum width for stack titles
        height: 20,
      };
      console.log('Stack Title Overlay Position:', stackTitlePos);
      return stackTitlePos;
    }

    // Handle card field editing
    const calculatedPos = {
      x: stageRect.left + nodeAbsolutePosition.x + TITLE_PADDING,
      y: stageRect.top + nodeAbsolutePosition.y + (editingField === 'title' ? TITLE_PADDING : TITLE_PADDING),
      width: editingKonvaNode.width() - TITLE_PADDING * 2,
      height: editingField === 'title' ? 20 : editingKonvaNode.height() - TITLE_PADDING * 2,
    };
    console.log('Card Overlay Position:', calculatedPos, 'Field:', editingField);
    return calculatedPos;
  };

  // Function to get card positions for markdown rendering
  const getCardScreenPositions = () => {
    const positions: Array<{
      card: NotecardData;
      x: number;
      y: number;
      width: number;
      height: number;
      scale: number;
      isEditing: boolean;
    }> = [];

    const SIDEBAR_WIDTH = LAYOUT.SIDEBAR_WIDTH; // Match the Canvas component sidebar offset
    const currentStacks = getFilteredStacks();

    currentStacks.forEach(stack => {
      if (stack.cards && stack.cards.length > 0) {
        // Only render markdown for the top (most visible) card in each stack
        const topCard = stack.cards[stack.cards.length - 1];
        const cardWidth = topCard.width || CARD_WIDTH;
        const cardHeight = topCard.height || CARD_HEIGHT;
        const borderPadding = 10;
        const HEADER_OFFSET = 40; // Match Stack component constant
        
        // Calculate the position of the top card within the stack (same logic as Stack component)
        const totalCards = stack.cards.length;
        const topCardIndex = totalCards - 1;
        const cardScale = 1.0; // Top card is always full scale within the stack
        const xOffset = borderPadding + (cardWidth * (1 - cardScale)) / 2;
        const yOffset = borderPadding + topCardIndex * HEADER_OFFSET + (cardHeight * (1 - cardScale)) / 2;
        
        // Apply canvas transformation (zoom and translation)
        const canvasX = stack.x + xOffset;
        const canvasY = stack.y + yOffset;
        
        
        // Apply the same transformation as the Konva Stage:
        // Konva Stage has: x={canvasTranslate.x * canvasZoom}, y={canvasTranslate.y * canvasZoom}, scaleX={canvasZoom}, scaleY={canvasZoom}
        // In Konva's transformation matrix: final = original * scale + translation
        // But since the translation is already pre-scaled by canvasZoom, we need:
        // final = original * scale + (pre-scaled translation)
        const screenX = SIDEBAR_WIDTH + (canvasX * canvasZoom) + (canvasTranslate.x * canvasZoom);
        const screenY = (canvasY * canvasZoom) + (canvasTranslate.y * canvasZoom);
        const screenWidth = cardWidth * canvasZoom;
        const screenHeight = cardHeight * canvasZoom;
        
        positions.push({
          card: topCard,
          x: screenX,
          y: screenY,
          width: screenWidth,
          height: screenHeight,
          scale: canvasZoom, // Pass the canvas zoom as scale for font sizing
          isEditing: editingCardId === topCard.id && editingField === 'content'
        });
      }
    });

    return positions;
  };

  const cardPositions = getCardScreenPositions();
  const filteredStacks = getFilteredStacks();
  const availableTags = getAllTags();
  const availableKeys = getAllKeys();
  
  const overlayPos = getOverlayPosition();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        onCreateCard={handleCreateCard}
        onSave={() => saveWorkspace(currentFilePath ?? undefined)}
        onSaveAs={() => saveWorkspace()}
        onLoad={loadWorkspace}
        onNew={newWorkspace}
        onLoadDemo={handleLoadDemo}
        hasUnsavedChanges={hasUnsavedChanges}
        currentFilePath={currentFilePath}
        searchFilters={searchFilters}
        onSearchChange={handleSearchChange}
        onTagFilterChange={handleTagFilterChange}
        onKeyFilterChange={handleKeyFilterChange}
        availableTags={availableTags}
        availableKeys={availableKeys}
        searchResults={searchResults}
        totalCards={stacks.reduce((count, stack) => count + stack.cards.length, 0)}
        filteredCards={filteredStacks.reduce((count, stack) => count + stack.cards.length, 0)}
        isTimelineVisible={isTimelineVisible}
        onTimelineToggle={handleTimelineToggle}
        canvasZoom={canvasZoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFocusToggle={handleFocusToggle}
        isFocusModeEnabled={isFocusModeEnabled}
      />
      <Canvas
        stacks={filteredStacks}
        connections={connections}
        isConnecting={isConnecting}
        currentConnection={currentConnection}
        onStackDragEnd={handleStackDragEnd}
        onStackDragMove={handleStackDragMove}
        onStackWheel={handleStackWheel}
        onConnectionDragMove={handleConnectionDragMove}
        onConnectionDragEnd={handleConnectionDragEnd}
        onConnectionDragStart={handleConnectionDragStart}
        onConnectionLabelEdit={handleConnectionLabelEdit}
        onConnectionDelete={handleConnectionDelete}
        onUpdateCard={handleUpdateCard} // Pass onUpdateCard
        onEditStart={handleEditStart} // Pass onEditStart
        onStackTitleEditStart={handleStackTitleEditStart} // Pass stack title editing
        onCardResize={handleCardResize} // Pass onCardResize
        onColorPickerOpen={handleColorPickerOpen} // Pass onColorPickerOpen
        onCardDelete={handleCardDeleteRequest} // Pass delete handler
        editingCardId={editingCardId} // Pass editing state
        editingField={editingField} // Pass editing field
        editingStackId={editingStackId} // Pass stack editing state
        editingConnectionId={editingConnectionId} // Pass connection editing state
        highlightedCardIds={highlightedCardIds} // Pass highlighted cards
        isTimelineVisible={isTimelineVisible} // Pass timeline visibility
        onTimelineCardClick={handleTimelineCardClick} // Pass timeline click handler
        onTimelineCardHover={handleTimelineCardHover} // Pass timeline hover handler
        canvasZoom={canvasZoom} // Pass canvas zoom
        canvasTranslate={canvasTranslate} // Pass canvas translation
      />
      {/* Markdown renderers for card content */}
      {cardPositions.map(({ card, x, y, width, height, scale, isEditing }) => 
        !isEditing && card.content && card.content.trim() !== '' ? (
          <MarkdownRenderer
            key={`markdown-${card.id}`}
            content={card.content}
            x={x}
            y={y}
            width={width}
            height={height}
            scale={scale}
            backgroundColor={card.backgroundColor}
            card={card}
            onEditStart={(cardId, field) => {
              // For MarkdownRenderer, we don't have a Konva node, but we can trigger edit mode
              setEditingCardId(cardId);
              setEditingField(field);
              // Find the card and set its current content as the editing value
              const targetCard = stacks.flatMap(s => s.cards).find(c => c.id === cardId);
              if (targetCard && field === 'content') {
                setEditingTextValue(targetCard.content || '');
              }
              // We'll set a dummy position for the editing overlay - it will recalculate properly
              setEditingKonvaNode(null);
            }}
          />
        ) : null
      )}
      {(((editingCardId && editingField) || editingConnectionId || (editingStackId && editingField === 'stack-title')) && (editingKonvaNode || (editingCardId && editingField === 'content') || (editingStackId && editingField === 'stack-title'))) && (
        <EditableTextOverlay
          x={overlayPos.x}
          y={overlayPos.y}
          width={overlayPos.width}
          height={overlayPos.height}
          value={editingTextValue}
          isTextArea={editingField === 'content'}
          inputType={editingField === 'date' ? 'date' : 'text'}
          fieldType={editingField || 'connection'}
          onChange={setEditingTextValue}
          onBlur={handleEditBlur}
        />
      )}
      {colorPickerCardId && (
        <ColorPicker
          selectedColor={stacks.flatMap(s => s.cards).find(c => c.id === colorPickerCardId)?.backgroundColor || CARD_COLORS.DEFAULT}
          onColorSelect={(color) => handleColorChange(colorPickerCardId, color)}
          onClose={handleColorPickerClose}
          x={colorPickerPosition.x}
          y={colorPickerPosition.y}
        />
      )}
      {deleteConfirmCardId && (
        <ConfirmDialog
          title="Delete Card"
          message={`Are you sure you want to delete the card "${stacks.flatMap(s => s.cards).find(c => c.id === deleteConfirmCardId)?.title || 'Untitled'}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          x={deleteConfirmPosition.x}
          y={deleteConfirmPosition.y}
        />
      )}
    </div>
  );
}

export default App;
