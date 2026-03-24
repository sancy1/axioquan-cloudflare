
// src/components/messaging/emoji-picker.tsx
// Lightweight custom emoji picker — no external dependencies
// React 19 compatible, matches dark/light theme
// Categories, search, recent emojis, click to insert

'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X } from 'lucide-react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose:  () => void
  theme:    Record<string, string>
}

// ── Emoji data ────────────────────────────────────────────────────────────────
const EMOJI_CATEGORIES = [
  {
    id:    'recent',
    label: 'Recent',
    icon:  '🕐',
    emojis: [] as string[], // populated from state
  },
  {
    id:    'smileys',
    label: 'Smileys',
    icon:  '😊',
    emojis: [
      '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃',
      '😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙',
      '🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫',
      '🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬',
      '🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢',
      '🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎',
      '🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳',
      '🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖',
      '😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬',
      '😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽',
    ],
  },
  {
    id:    'gestures',
    label: 'Gestures',
    icon:  '👋',
    emojis: [
      '👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞',
      '🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍',
      '👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝',
      '🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂',
      '🦻','👃','🫀','🫁','🧠','🦷','🦴','👀','👁️','👅',
      '👄','💋','🩸',
    ],
  },
  {
    id:    'people',
    label: 'People',
    icon:  '👨',
    emojis: [
      '👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓',
      '👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇',
      '🤦','🤷','👮','🕵️','💂','🥷','👷','🫅','🤴','👸',
      '👳','👲','🧕','🤵','👰','🤰','🫃','🤱','👼','🎅',
      '🤶','🧙','🧝','🧛','🧟','🧞','🧜','🧚','🧑‍⚕️','👩‍⚕️',
      '👨‍⚕️','🧑‍🎓','👩‍🎓','👨‍🎓','🧑‍🏫','👩‍🏫','👨‍🏫','🧑‍⚖️','👩‍⚖️','👨‍⚖️',
    ],
  },
  {
    id:    'animals',
    label: 'Animals',
    icon:  '🐶',
    emojis: [
      '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
      '🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧',
      '🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄',
      '🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪲','🦟','🦗',
      '🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀',
      '🐡','🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅',
      '🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫',
    ],
  },
  {
    id:    'food',
    label: 'Food',
    icon:  '🍔',
    emojis: [
      '🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈',
      '🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦',
      '🥬','🥒','🌶️','🫑','🧄','🧅','🥔','🍠','🫘','🥐',
      '🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇',
      '🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🫓','🥪',
      '🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝',
      '🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚',
      '🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬',
    ],
  },
  {
    id:    'travel',
    label: 'Travel',
    icon:  '✈️',
    emojis: [
      '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐',
      '🛻','🚚','🚛','🚜','🏍️','🛵','🛺','🚲','🛴','🛹',
      '🚏','🛣️','🛤️','⛽','🚧','⚓','🪝','⛵','🚤','🛥️',
      '🛳️','⛴️','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁',
      '🚟','🚠','🚡','🛰️','🚀','🛸','🌍','🌎','🌏','🪐',
      '🌋','🏔️','⛰️','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️',
    ],
  },
  {
    id:    'objects',
    label: 'Objects',
    icon:  '💡',
    emojis: [
      '⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','💽','💾',
      '💿','📀','📷','📸','📹','🎥','📞','☎️','📟','📠',
      '📺','📻','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡',
      '🔋','🪫','🔌','💡','🔦','🕯️','🪔','🧯','💰','💴',
      '💵','💷','💸','💳','🪙','💎','⚖️','🪜','🧰','🪛',
      '🔧','🪚','🔨','⚒️','🛠️','⛏️','🪝','🧲','🪤','🔑',
      '🗝️','🔒','🔓','🪪','🚪','🪞','🪑','🛋️','🚿','🛁',
    ],
  },
  {
    id:    'symbols',
    label: 'Symbols',
    icon:  '❤️',
    emojis: [
      '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔',
      '❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝',
      '💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️',
      '☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎',
      '♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️',
      '📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮',
      '🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎',
      '🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯',
      '💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗',
      '❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸',
    ],
  },
]

const RECENT_KEY = 'messaging_recent_emojis'

function getRecent(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecent(emoji: string) {
  if (typeof window === 'undefined') return
  const recent = getRecent().filter((e) => e !== emoji)
  const updated = [emoji, ...recent].slice(0, 24)
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
}

export default function EmojiPicker({
  onSelect,
  onClose,
  theme,
}: EmojiPickerProps) {
  const [search, setSearch]         = useState('')
  const [activeCategory, setActive] = useState('smileys')
  const [recent, setRecent]         = useState<string[]>([])
  const searchRef                   = useRef<HTMLInputElement>(null)
  const containerRef                = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRecent(getRecent())
    setTimeout(() => searchRef.current?.focus(), 50)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleSelect = (emoji: string) => {
    saveRecent(emoji)
    setRecent(getRecent())
    onSelect(emoji)
  }

  // Build categories with recent
  const categories = useMemo(() => {
    return EMOJI_CATEGORIES.map((cat) =>
      cat.id === 'recent' ? { ...cat, emojis: recent } : cat
    ).filter((cat) => cat.id !== 'recent' || cat.emojis.length > 0)
  }, [recent])

  // Search results
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return EMOJI_CATEGORIES.flatMap((cat) =>
      cat.id === 'recent' ? [] : cat.emojis
    ).filter((emoji) => {
      // Simple filter — emoji code point description matching
      return emoji.includes(q) || emoji.codePointAt(0)?.toString(16).includes(q)
    }).slice(0, 48)
  }, [search])

  const displayCategories = search.trim()
    ? [{ id: 'search', label: 'Search results', icon: '🔍', emojis: searchResults }]
    : categories

  return (
    <div
      ref={containerRef}
      className={`
        absolute bottom-full right-0 mb-2 z-50
        w-80 rounded-xl border ${theme.border} ${theme.surface}
        shadow-2xl overflow-hidden flex flex-col
      `}
      style={{ height: 360 }}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b ${theme.border}`}>
        <Search className={`w-3.5 h-3.5 ${theme.textMuted} flex-shrink-0`} />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji..."
          className={`
            flex-1 bg-transparent text-xs ${theme.text}
            placeholder:text-[#4a5568] outline-none
          `}
        />
        {search && (
          <button onClick={() => setSearch('')} className={theme.textMuted}>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      {!search && (
        <div className={`flex overflow-x-auto border-b ${theme.border} px-1 py-1 gap-0.5 scrollbar-none`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              title={cat.label}
              className={`
                flex-shrink-0 w-8 h-8 rounded-lg text-sm flex items-center justify-center
                transition-colors
                ${activeCategory === cat.id ? theme.accentSoft : 'hover:' + theme.surface2}
              `}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {displayCategories.map((cat) => {
          const emojis = cat.id === 'search'
            ? searchResults
            : cat.id === activeCategory || search
              ? cat.emojis
              : []

          if (!search && cat.id !== activeCategory) return null
          if (emojis.length === 0) {
            return (
              <div key={cat.id} className={`flex items-center justify-center h-20 text-xs ${theme.textMuted}`}>
                {search ? 'No emoji found' : 'No recent emoji yet'}
              </div>
            )
          }

          return (
            <div key={cat.id}>
              <div className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted} mb-1.5 px-1`}>
                {cat.label}
              </div>
              <div className="grid grid-cols-8 gap-0.5">
                {emojis.map((emoji, i) => (
                  <button
                    key={`${emoji}-${i}`}
                    onClick={() => handleSelect(emoji)}
                    className={`
                      w-8 h-8 flex items-center justify-center text-lg rounded-lg
                      hover:${theme.surface2} transition-colors
                      active:scale-90
                    `}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}