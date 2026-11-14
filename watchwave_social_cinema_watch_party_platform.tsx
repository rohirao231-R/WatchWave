import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home,
  Compass,
  Tv,
  Star,
  Bookmark,
  Users,
  Settings,
  Search,
  Bell,
  Play,
  Pause,
  Plus,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  LogOut,
  Send,
  Crown,
  Sparkles,
  Film,
  Clock,
  Eye,
  EyeOff,
  Shield,
  SlidersHorizontal,
  UserPlus,
  X,
  ChevronRight,
  Radio,
  LogIn,
  UserCheck,
  Menu,
  ArrowRight,
  Layers,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Share2,
} from 'lucide-react';

// ============================================================================
// 1. TYPES & INTERFACES (Strict TypeScript Domain Models)
// ============================================================================

export type PageRoute =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'discover'
  | 'rooms'
  | 'reviews'
  | 'watchlist'
  | 'friends'
  | 'profile'
  | 'settings';

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  year: number;
  duration: string;
  durationSeconds: number;
  genres: string[];
  director: string;
  synopsis: string;
  backdropUrl: string;
  posterUrl: string;
  groupRating: number;
  maturityRating: string;
  featured?: boolean;
  watchedDate?: string;
}

export interface Participant {
  id: string;
  name: string;
  handle: string;
  avatarInitials: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  cameraOn: boolean;
  micOn: boolean;
  isSelf?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  handle: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface WatchRoom {
  id: string;
  name: string;
  movieId: string;
  hostName: string;
  hostHandle: string;
  privacy: 'Public' | 'Friends Only';
  isLive: boolean;
  thumbnailUrl: string;
  participants: Participant[];
  messages: ChatMessage[];
}

export interface Friend {
  id: string;
  name: string;
  handle: string;
  initials: string;
  status: 'online' | 'watching' | 'offline';
  activity: string;
  mutualMovies: number;
}

export interface Review {
  id: string;
  movieId: string;
  movieTitle: string;
  reviewerName: string;
  reviewerHandle: string;
  reviewerInitials: string;
  rating: number; // Supports 0.5 increments (0.5 to 5.0)
  content: string;
  hasSpoilers: boolean;
  verifiedSession: boolean;
  createdAt: string;
  likes: number;
}

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  badge?: string;
}

// ============================================================================
// 2. MOCK DATA MODULE (Clearly separated placeholder dataset for UI preview)
// ============================================================================

const MOCK_MOVIES: Movie[] = [
  {
    id: 'mov-nocturne',
    title: 'NOCTURNE PROTOCOL',
    tagline: 'Every signal leaves a shadow in the dark.',
    year: 2026,
    duration: '2h 28m',
    durationSeconds: 8880,
    genres: ['Sci-Fi', 'Neo-Noir', 'Thriller'],
    director: 'Kaelen Vance',
    synopsis:
      'In a rain-lashed orbital relay station cut off from Earth, an archival cryptographer uncovers a decades-old transmission predicting the exact collapse of the silence treaty.',
    backdropUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    groupRating: 4.8,
    maturityRating: 'R',
    featured: true,
    watchedDate: '2 days ago',
  },
  {
    id: 'mov-obsidian',
    title: 'OBSIDIAN TIDE',
    tagline: 'Below the surface, memory has weight.',
    year: 2025,
    duration: '2h 11m',
    durationSeconds: 7860,
    genres: ['Thriller', 'Drama'],
    director: 'Sora Takahashi',
    synopsis:
      'A deep-sea salvage crew recovers an unmarked black box from the Mariana Trench, triggering a psychological standoff aboard their icebound research vessel.',
    backdropUrl:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    groupRating: 4.5,
    maturityRating: 'PG-13',
    watchedDate: '5 days ago',
  },
  {
    id: 'mov-monolith',
    title: 'SILENT MONOLITH',
    tagline: 'Architecture built for an audience of none.',
    year: 2026,
    duration: '1h 54m',
    durationSeconds: 6840,
    genres: ['Documentary', 'Sci-Fi'],
    director: 'Elena Rostova',
    synopsis:
      'Shot entirely in stark monochrome 70mm, this visual essay explores brutalist acoustic mirrors and abandoned radio observatories across the Arctic Circle.',
    backdropUrl:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    groupRating: 4.9,
    maturityRating: 'PG',
    watchedDate: 'Last week',
  },
  {
    id: 'mov-velvet-static',
    title: 'VELVET STATIC',
    tagline: 'Midnight frequencies never lie.',
    year: 2024,
    duration: '2h 04m',
    durationSeconds: 7440,
    genres: ['Neo-Noir', 'Drama'],
    director: 'Marcus Thorne',
    synopsis:
      'An overnight jazz radio host in 1979 Chicago receives an on-air confession that ties a string of vanishing act performers to the city’s highest office.',
    backdropUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    groupRating: 4.4,
    maturityRating: 'R',
    watchedDate: '2 weeks ago',
  },
  {
    id: 'mov-ash-crown',
    title: 'CROWN OF ASH',
    tagline: 'An empire forged in winter.',
    year: 2025,
    duration: '2h 36m',
    durationSeconds: 9360,
    genres: ['Drama', 'Thriller'],
    director: 'Henrik Lindqvist',
    synopsis:
      'Three estranged heirs gather at an isolated mountain foundry during a solar eclipse to contest the succession of an industrial dynasty.',
    backdropUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80',
    groupRating: 4.6,
    maturityRating: 'R',
  },
  {
    id: 'mov-glass-horizon',
    title: 'THE GLASS HORIZON',
    tagline: 'Beyond the perimeter, light bends.',
    year: 2026,
    duration: '2h 18m',
    durationSeconds: 8280,
    genres: ['Sci-Fi', 'Drama'],
    director: 'Nadia Al-Mansoor',
    synopsis:
      'Cartographers mapping an anomalous desert mirror phenomenon discover their own reflections are moving six seconds ahead of real time.',
    backdropUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
    groupRating: 4.7,
    maturityRating: 'PG-13',
  },
];

const INITIAL_ROOMS: WatchRoom[] = [
  {
    id: 'room-midnight-reel',
    name: 'Midnight Noir Premiere Club',
    movieId: 'mov-nocturne',
    hostName: 'Aria Chen',
    hostHandle: '@ariachen',
    privacy: 'Public',
    isLive: true,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    participants: [
      {
        id: 'p-1',
        name: 'Aria Chen',
        handle: '@ariachen',
        avatarInitials: 'AC',
        isHost: true,
        isSpeaking: true,
        cameraOn: false,
        micOn: true,
      },
      {
        id: 'p-2',
        name: 'Devon Brooks',
        handle: '@devonb',
        avatarInitials: 'DB',
        cameraOn: false,
        micOn: true,
      },
      {
        id: 'p-3',
        name: 'Mina Solis',
        handle: '@minasolis',
        avatarInitials: 'MS',
        cameraOn: false,
        micOn: false,
      },
      {
        id: 'p-4',
        name: 'Julian Mercer',
        handle: '@jmercer',
        avatarInitials: 'JM',
        cameraOn: false,
        micOn: false,
      },
    ],
    messages: [
      {
        id: 'm-1',
        sender: 'System',
        handle: 'system',
        text: 'Watch session synced at 00:42:18 • 24fps Cinema Master',
        timestamp: '21:14',
        isSystem: true,
      },
      {
        id: 'm-2',
        sender: 'Aria Chen',
        handle: '@ariachen',
        text: 'Wait until you hear the score drop in this relay room scene.',
        timestamp: '21:15',
      },
      {
        id: 'm-3',
        sender: 'Devon Brooks',
        handle: '@devonb',
        text: 'The shadow framing on 70mm is unreal. Zero compression artifacts.',
        timestamp: '21:16',
      },
    ],
  },
  {
    id: 'room-deep-trench',
    name: 'Director’s Cut Friday',
    movieId: 'mov-obsidian',
    hostName: 'Liam Gallagher',
    hostHandle: '@liamg',
    privacy: 'Friends Only',
    isLive: true,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
    participants: [
      {
        id: 'p-5',
        name: 'Liam Gallagher',
        handle: '@liamg',
        avatarInitials: 'LG',
        isHost: true,
        cameraOn: false,
        micOn: true,
      },
      {
        id: 'p-6',
        name: 'Sora Kim',
        handle: '@sorakim',
        avatarInitials: 'SK',
        isSpeaking: true,
        cameraOn: false,
        micOn: true,
      },
      {
        id: 'p-7',
        name: 'Theo Vance',
        handle: '@theov',
        avatarInitials: 'TV',
        cameraOn: false,
        micOn: false,
      },
    ],
    messages: [
      {
        id: 'm-20',
        sender: 'System',
        handle: 'system',
        text: 'Room created by Liam Gallagher',
        timestamp: '20:50',
        isSystem: true,
      },
      {
        id: 'm-21',
        sender: 'Sora Kim',
        handle: '@sorakim',
        text: 'That sonar pulse gave me chills.',
        timestamp: '21:04',
      },
    ],
  },
  {
    id: 'room-brutalist',
    name: '70mm Documentary Circle',
    movieId: 'mov-monolith',
    hostName: 'Elena Rostova',
    hostHandle: '@erostova',
    privacy: 'Public',
    isLive: true,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
    participants: [
      {
        id: 'p-8',
        name: 'Elena Rostova',
        handle: '@erostova',
        avatarInitials: 'ER',
        isHost: true,
        cameraOn: false,
        micOn: true,
      },
      {
        id: 'p-9',
        name: 'Noah Sterling',
        handle: '@nsterling',
        avatarInitials: 'NS',
        cameraOn: false,
        micOn: false,
      },
    ],
    messages: [
      {
        id: 'm-30',
        sender: 'Elena Rostova',
        handle: '@erostova',
        text: 'Welcome everyone — Q&A thread open right after credits.',
        timestamp: '21:10',
      },
    ],
  },
];

const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f-1',
    name: 'Aria Chen',
    handle: '@ariachen',
    initials: 'AC',
    status: 'watching',
    activity: 'Hosting Midnight Noir Premiere Club',
    mutualMovies: 34,
  },
  {
    id: 'f-2',
    name: 'Devon Brooks',
    handle: '@devonb',
    initials: 'DB',
    status: 'watching',
    activity: 'Watching Nocturne Protocol',
    mutualMovies: 28,
  },
  {
    id: 'f-3',
    name: 'Mina Solis',
    handle: '@minasolis',
    initials: 'MS',
    status: 'online',
    activity: 'Browsing Sci-Fi & Neo-Noir',
    mutualMovies: 19,
  },
  {
    id: 'f-4',
    name: 'Liam Gallagher',
    handle: '@liamg',
    initials: 'LG',
    status: 'online',
    activity: 'In Lobby • Ready for movie night',
    mutualMovies: 41,
  },
  {
    id: 'f-5',
    name: 'Sora Kim',
    handle: '@sorakim',
    initials: 'SK',
    status: 'offline',
    activity: 'Last active 3h ago',
    mutualMovies: 15,
  },
  {
    id: 'f-6',
    name: 'Julian Mercer',
    handle: '@jmercer',
    initials: 'JM',
    status: 'offline',
    activity: 'Last active yesterday',
    mutualMovies: 22,
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    movieId: 'mov-nocturne',
    movieTitle: 'NOCTURNE PROTOCOL',
    reviewerName: 'Aria Chen',
    reviewerHandle: '@ariachen',
    reviewerInitials: 'AC',
    rating: 5.0,
    content:
      'A masterclass in acoustic tension and monochrome contrast. Watching this synchronized with four friends in voice chat amplified every single reveal.',
    hasSpoilers: false,
    verifiedSession: true,
    createdAt: '2 hours ago',
    likes: 24,
  },
  {
    id: 'rev-2',
    movieId: 'mov-nocturne',
    movieTitle: 'NOCTURNE PROTOCOL',
    reviewerName: 'Devon Brooks',
    reviewerHandle: '@devonb',
    reviewerInitials: 'DB',
    rating: 4.5,
    content:
      'When the archival cryptographer realizes the transmission originates from his own future console in Act III, our entire watch room went dead silent.',
    hasSpoilers: true,
    verifiedSession: true,
    createdAt: '5 hours ago',
    likes: 18,
  },
  {
    id: 'rev-3',
    movieId: 'mov-obsidian',
    movieTitle: 'OBSIDIAN TIDE',
    reviewerName: 'Mina Solis',
    reviewerHandle: '@minasolis',
    reviewerInitials: 'MS',
    rating: 4.5,
    content:
      'Claustrophobic, tactile, and relentlessly paced. The sound design of the hull groaning under pressure demands good headphones.',
    hasSpoilers: false,
    verifiedSession: true,
    createdAt: '1 day ago',
    likes: 15,
  },
  {
    id: 'rev-4',
    movieId: 'mov-monolith',
    movieTitle: 'SILENT MONOLITH',
    reviewerName: 'Liam Gallagher',
    reviewerHandle: '@liamg',
    reviewerInitials: 'LG',
    rating: 5.0,
    content:
      'Pure architectural cinema. Every frame looks like a silver-gelatin darkroom print.',
    hasSpoilers: false,
    verifiedSession: false,
    createdAt: '3 days ago',
    likes: 31,
  },
];

// ============================================================================
// 3. REUSABLE DESIGN SYSTEM COMPONENTS (Strict Monochrome + Crimson)
// ============================================================================

/**
 * Brand Logo Mark: Crisp geometric wave & cinema aperture in white + crimson
 */
const WatchwaveLogo: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="flex items-center gap-3 select-none">
    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#101010] border border-white/15 shadow-inner">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3 7L7.5 17L12 9L16.5 17L21 7"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="17.5" r="2" fill="#E50924" />
      </svg>
    </div>
    {!compact && (
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-[0.22em] text-white leading-none">
          WATCH<span className="text-[#E50924]">WAVE</span>
        </span>
        <span className="text-[10px] tracking-[0.18em] text-[#686868] uppercase mt-1">
          Cinema Social
        </span>
      </div>
    )}
  </div>
);

/**
 * Half & Full Star Rating Display + Interactive Picker (Strictly White/Grey & Crimson)
 */
const StarRating: React.FC<{
  rating: number;
  max?: number;
  interactive?: boolean;
  size?: number;
  onChange?: (val: number) => void;
}> = ({ rating, max = 5, interactive = false, size = 16, onChange }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const activeValue = hoverRating !== null ? hoverRating : rating;

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setHoverRating(starIndex + (isLeftHalf ? 0.5 : 1));
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (!interactive || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    onChange(starIndex + (isLeftHalf ? 0.5 : 1));
  };

  return (
    <div
      className="inline-flex items-center gap-1"
      onMouseLeave={() => interactive && setHoverRating(null)}
      role={interactive ? 'slider' : undefined}
      aria-label={`Rating ${rating} out of ${max} stars`}
      aria-valuenow={rating}
    >
      {Array.from({ length: max }).map((_, idx) => {
        const fillAmount = Math.max(0, Math.min(1, activeValue - idx));
        return (
          <button
            key={idx}
            type="button"
            disabled={!interactive}
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onClick={(e) => handleClick(e, idx)}
            className={`relative p-0 border-0 bg-transparent ${
              interactive
                ? 'cursor-pointer transition-transform hover:scale-110 focus:outline-none'
                : 'cursor-default'
            }`}
            style={{ width: size, height: size }}
            aria-label={interactive ? `Rate ${idx + 1} stars` : undefined}
          >
            {/* Empty star base */}
            <Star
              size={size}
              className="text-[#3F3F46] fill-[#1A1A1A] stroke-[1.75]"
            />
            {/* Clipped filled star in Crimson */}
            {fillAmount > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillAmount * 100}%` }}
              >
                <Star
                  size={size}
                  className="text-[#E50924] fill-[#E50924] stroke-[1.75]"
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Monochrome Cinematic Image wrapper (forces zero non-approved color bleed)
 */
const CinemaArtwork: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={`grayscale contrast-125 brightness-90 object-cover ${className}`}
  />
);

// ============================================================================
// 4. MAIN APPLICATION COMPONENT
// ============================================================================

export function App() {
  // Navigation & Auth State
  const [activeRoute, setActiveRoute] = useState<PageRoute>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Mercer',
    handle: '@alexmercer',
    email: 'alex.mercer@watchwave.io',
    initials: 'AM',
    bio: 'Midnight 70mm enthusiast & neo-noir curator.',
  });

  // Domain State
  const [movies] = useState<Movie[]>(MOCK_MOVIES);
  const [rooms, setRooms] = useState<WatchRoom[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>(INITIAL_ROOMS[0].id);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([
    'mov-nocturne',
    'mov-monolith',
    'mov-glass-horizon',
  ]);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Global UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalMovieId, setCreateModalMovieId] = useState<string>(
    MOCK_MOVIES[0].id
  );
  const [selectedReviewMovieId, setSelectedReviewMovieId] = useState<string>(
    MOCK_MOVIES[0].id
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Notifications mock list
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Aria Chen invited you to Midnight Noir Premiere Club',
      time: '4m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Devon Brooks posted a review on NOCTURNE PROTOCOL',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Weekly Watch Club recap is ready',
      time: 'Yesterday',
      unread: false,
    },
  ]);

  // Toast helper
  const showToast = (title: string, description?: string, badge?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, title, description, badge }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Watchlist toggle handler
  const toggleWatchlist = (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return;
    setWatchlistIds((prev) => {
      const exists = prev.includes(movieId);
      if (exists) {
        showToast('Removed from Watchlist', movie.title, 'LOCAL STATE');
        return prev.filter((id) => id !== movieId);
      } else {
        showToast('Added to Watchlist', movie.title, 'LOCAL STATE');
        return [...prev, movieId];
      }
    });
  };

  // Open Create Watch Party modal prefilled with a movie
  const openCreatePartyModal = (movieId?: string) => {
    if (movieId) setCreateModalMovieId(movieId);
    setIsCreateModalOpen(true);
  };

  // Create new Watch Room & enter immediately
  const handleCreateRoom = (
    name: string,
    movieId: string,
    privacy: 'Public' | 'Friends Only'
  ) => {
    const movie = movies.find((m) => m.id === movieId) || movies[0];
    const newRoom: WatchRoom = {
      id: `room-${Date.now()}`,
      name: name.trim() || `${movie.title} Watch Party`,
      movieId: movie.id,
      hostName: currentUser.name,
      hostHandle: currentUser.handle,
      privacy,
      isLive: true,
      thumbnailUrl: movie.backdropUrl,
      participants: [
        {
          id: 'self-user',
          name: currentUser.name,
          handle: currentUser.handle,
          avatarInitials: currentUser.initials,
          isHost: true,
          cameraOn: false,
          micOn: false,
          isSelf: true,
        },
      ],
      messages: [
        {
          id: `sys-${Date.now()}`,
          sender: 'System',
          handle: 'system',
          text: `Watch room "${
            name.trim() || movie.title
          }" initialized. Ready for LiveKit WebRTC & Supabase Realtime.`,
          timestamp: 'Now',
          isSystem: true,
        },
      ],
    };

    setRooms((prev) => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setIsCreateModalOpen(false);
    setActiveRoute('rooms');
    showToast(
      'Watch Party Created',
      `Joined "${newRoom.name}"`,
      'FRONTEND PREVIEW'
    );
  };

  // Join existing Watch Room
  const handleJoinRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const alreadyIn = r.participants.some((p) => p.isSelf);
        if (alreadyIn) return r;
        return {
          ...r,
          participants: [
            ...r.participants,
            {
              id: 'self-user',
              name: currentUser.name,
              handle: currentUser.handle,
              avatarInitials: currentUser.initials,
              cameraOn: false,
              micOn: false,
              isSelf: true,
            },
          ],
          messages: [
            ...r.messages,
            {
              id: `join-${Date.now()}`,
              sender: 'System',
              handle: 'system',
              text: `${currentUser.name} joined the theater.`,
              timestamp: 'Now',
              isSystem: true,
            },
          ],
        };
      })
    );
    setActiveRoomId(roomId);
    setActiveRoute('rooms');
    const target = rooms.find((r) => r.id === roomId);
    if (target) {
      showToast('Entered Watch Room', target.name, 'SYNCED');
    }
  };

  // Quick search matches
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { movies: [], rooms: [] };
    return {
      movies: movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.director.toLowerCase().includes(q)
      ),
      rooms: rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.hostName.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, movies, rooms]);

  // If user is on Landing, Login, or Register, render standalone full-bleed views
  if (activeRoute === 'landing') {
    return (
      <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-[#E50924] selection:text-white">
        <LandingView
          movies={movies}
          onEnterApp={() => setActiveRoute('dashboard')}
          onNavigate={(route) => setActiveRoute(route)}
          onStartParty={(movieId) => {
            setActiveRoute('dashboard');
            openCreatePartyModal(movieId);
          }}
        />
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  if (activeRoute === 'login' || activeRoute === 'register') {
    return (
      <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-[#E50924] selection:text-white">
        <AuthView
          mode={activeRoute}
          onSwitchMode={(m) => setActiveRoute(m)}
          onSuccess={(email, name) => {
            setIsAuthenticated(true);
            if (name) {
              const initials = name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              setCurrentUser((prev) => ({
                ...prev,
                name,
                email,
                handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
                initials: initials || 'AM',
              }));
            } else {
              setCurrentUser((prev) => ({ ...prev, email }));
            }
            setActiveRoute('dashboard');
            showToast(
              activeRoute === 'login' ? 'Signed in to WATCHWAVE' : 'Account Created',
              `Welcome back, ${name || currentUser.name}`,
              'MOCK AUTH'
            );
          }}
          onBackLanding={() => setActiveRoute('landing')}
        />
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  const navItems: { id: PageRoute; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home size={18} /> },
    { id: 'discover', label: 'Discover', icon: <Compass size={18} /> },
    {
      id: 'rooms',
      label: 'Watch Rooms',
      icon: <Tv size={18} />,
      badge: `${rooms.length}`,
    },
    { id: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: <Bookmark size={18} />,
      badge: watchlistIds.length > 0 ? `${watchlistIds.length}` : undefined,
    },
    { id: 'friends', label: 'Friends', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col lg:flex-row font-sans selection:bg-[#E50924] selection:text-white overflow-x-hidden">
      {/* ====================================================================
          DESKTOP SIDEBAR
         ==================================================================== */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#101010]/90 backdrop-blur-xl border-r border-white/10 z-30">
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveRoute('dashboard')}
            className="text-left focus:outline-none"
          >
            <WatchwaveLogo />
          </button>
        </div>

        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-[#686868] uppercase">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveRoute(item.id)}
                className={`w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.07] text-white border border-white/10'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#E50924]" />
                )}
                <span className="flex items-center gap-3">
                  <span
                    className={
                      isActive
                        ? 'text-[#E50924]'
                        : 'text-[#A1A1AA] group-hover:text-white transition-colors'
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-[#E50924]/20 text-white border-[#E50924]/40'
                        : 'bg-white/[0.04] text-[#A1A1AA] border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-[#686868] uppercase">
              Platform Preview
            </div>
            <button
              type="button"
              onClick={() => setActiveRoute('landing')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span className="flex items-center gap-3">
                <Film size={18} />
                Landing Showcase
              </span>
              <ChevronRight size={14} className="text-[#686868]" />
            </button>
          </div>
        </div>

        {/* Bottom Architecture Readiness Card */}
        <div className="p-4 m-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-2 text-xs font-medium text-white">
            <span className="h-2 w-2 rounded-full bg-[#E50924] animate-pulse" />
            UI Milestone Preview
          </div>
          <p className="text-[11px] text-[#686868] mt-1 leading-relaxed">
            Simulated social playback. Architected for Supabase &amp; LiveKit WebRTC.
          </p>
        </div>
      </aside>

      {/* ====================================================================
          MOBILE DRAWER NAVIGATION
         ==================================================================== */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-[82vw] bg-[#101010] border-r border-white/10 flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <WatchwaveLogo />
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveRoute(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-white/[0.08] text-white border border-white/10'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#E50924]' : ''}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setActiveRoute('landing');
                  setIsMobileNavOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-[#A1A1AA] hover:text-white"
              >
                <Film size={18} />
                Landing Page
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN CONTENT SHELL + TOP BAR
         ==================================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-[#080808]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white hover:bg-white/10"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#686868]"
              />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search movies, genres, or watch rooms..."
                className="w-full bg-white/[0.045] border border-white/10 focus:border-white/25 rounded-xl pl-10 pr-8 py-2 text-sm text-white placeholder-[#686868] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#686868] hover:text-white"
                >
                  <X size={14} />
                </button>
              )}

              {/* Live Search Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSearchOpen(false)}
                  />
                  <div className="absolute left-0 right-0 mt-2 bg-[#101010] border border-white/15 rounded-2xl shadow-2xl p-3 z-20 max-h-96 overflow-y-auto">
                    {searchResults.movies.length === 0 &&
                    searchResults.rooms.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#686868]">
                        No matching titles or rooms for “{searchQuery}”
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {searchResults.movies.length > 0 && (
                          <div>
                            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#686868]">
                              Movies
                            </div>
                            {searchResults.movies.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSelectedReviewMovieId(m.id);
                                  setActiveRoute('discover');
                                }}
                                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <CinemaArtwork
                                    src={m.posterUrl}
                                    alt={m.title}
                                    className="w-8 h-11 rounded object-cover border border-white/10"
                                  />
                                  <div>
                                    <div className="text-xs font-semibold text-white">
                                      {m.title}
                                    </div>
                                    <div className="text-[11px] text-[#A1A1AA]">
                                      {m.year} • {m.genres.join(', ')}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[11px] text-[#E50924] font-medium">
                                  View
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.rooms.length > 0 && (
                          <div>
                            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#686868]">
                              Live Watch Rooms
                            </div>
                            {searchResults.rooms.map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  handleJoinRoom(r.id);
                                }}
                                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] text-left"
                              >
                                <div>
                                  <div className="text-xs font-semibold text-white">
                                    {r.name}
                                  </div>
                                  <div className="text-[11px] text-[#A1A1AA]">
                                    Hosted by {r.hostName}
                                  </div>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#E50924] text-white font-semibold">
                                  JOIN
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen((o) => !o);
                  setIsProfileMenuOpen(false);
                }}
                className="relative p-2.5 rounded-xl bg-white/[0.045] border border-white/10 text-[#A1A1AA] hover:text-white hover:bg-white/[0.08] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E50924]" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-[#101010] border border-white/15 rounded-2xl shadow-2xl p-4 z-20">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-semibold tracking-wider uppercase text-white">
                        Notifications
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, unread: false }))
                          );
                          showToast('All notifications marked as read');
                        }}
                        className="text-[11px] text-[#A1A1AA] hover:text-white"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="py-3 flex items-start justify-between gap-3"
                        >
                          <div className="text-xs text-[#D4D4D8] leading-snug">
                            {n.title}
                            <div className="text-[10px] text-[#686868] mt-1">
                              {n.time}
                            </div>
                          </div>
                          {n.unread && (
                            <span className="h-2 w-2 rounded-full bg-[#E50924] shrink-0 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen((o) => !o);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-white/[0.045] border border-white/10 hover:bg-white/[0.08] transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-[#1A1A1A] border border-white/15 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.initials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-white leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#686868] mt-0.5">
                    {isAuthenticated ? 'Member' : 'Guest'}
                  </div>
                </div>
              </button>

              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#101010] border border-white/15 rounded-2xl shadow-2xl p-2 z-20">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="text-xs font-semibold text-white">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-[#686868]">
                        {currentUser.handle}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRoute('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#D4D4D8] hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5"
                    >
                      <UserCheck size={14} /> Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRoute('settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#D4D4D8] hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5"
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRoute('landing');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#D4D4D8] hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5"
                    >
                      <Film size={14} /> Landing Page
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthenticated(false);
                        setIsProfileMenuOpen(false);
                        setActiveRoute('login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#E50924] hover:bg-[#E50924]/10 flex items-center gap-2.5 font-medium"
                    >
                      <LogOut size={14} /> Sign Out / Switch Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ==================================================================
            ACTIVE PAGE ROUTE VIEWPORT
           ================================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeRoute === 'dashboard' && (
            <DashboardView
              movies={movies}
              rooms={rooms}
              friends={friends}
              reviews={reviews}
              watchlistIds={watchlistIds}
              onCreateParty={() => openCreatePartyModal()}
              onStartMovieParty={(movieId) => openCreatePartyModal(movieId)}
              onToggleWatchlist={toggleWatchlist}
              onJoinRoom={handleJoinRoom}
              onInviteFriend={(friend) =>
                showToast(
                  `Invite sent to ${friend.name}`,
                  'Watch room link copied to session',
                  'MOCK INVITE'
                )
              }
              onNavigate={(route) => setActiveRoute(route)}
              onOpenMovieReview={(movieId) => {
                setSelectedReviewMovieId(movieId);
                setActiveRoute('reviews');
              }}
            />
          )}

          {activeRoute === 'discover' && (
            <DiscoverView
              movies={movies}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              onStartParty={(movieId) => openCreatePartyModal(movieId)}
              onReviewMovie={(movieId) => {
                setSelectedReviewMovieId(movieId);
                setActiveRoute('reviews');
              }}
            />
          )}

          {activeRoute === 'rooms' && (
            <WatchRoomExperience
              rooms={rooms}
              activeRoomId={activeRoomId}
              movies={movies}
              currentUser={currentUser}
              onSelectRoom={(id) => handleJoinRoom(id)}
              onLeaveRoom={() => {
                setActiveRoute('dashboard');
                showToast('Left Watch Room', 'Returned to Dashboard');
              }}
              onCreateRoom={() => openCreatePartyModal()}
              onSendMessage={(roomId, text) => {
                setRooms((prev) =>
                  prev.map((r) =>
                    r.id === roomId
                      ? {
                          ...r,
                          messages: [
                            ...r.messages,
                            {
                              id: `msg-${Date.now()}`,
                              sender: currentUser.name,
                              handle: currentUser.handle,
                              text,
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              }),
                            },
                          ],
                        }
                      : r
                  )
                );
              }}
              showToast={showToast}
            />
          )}

          {activeRoute === 'reviews' && (
            <ReviewsView
              movies={movies}
              selectedMovieId={selectedReviewMovieId}
              onSelectMovie={setSelectedReviewMovieId}
              reviews={reviews}
              currentUser={currentUser}
              onAddReview={(newReview) => {
                setReviews((prev) => [newReview, ...prev]);
                showToast(
                  'Review Published',
                  `Rated ${newReview.movieTitle} ${newReview.rating.toFixed(1)} ★`,
                  'LOCAL STATE'
                );
              }}
            />
          )}

          {activeRoute === 'watchlist' && (
            <WatchlistView
              movies={movies.filter((m) => watchlistIds.includes(m.id))}
              onRemove={toggleWatchlist}
              onStartParty={(movieId) => openCreatePartyModal(movieId)}
              onExplore={() => setActiveRoute('discover')}
            />
          )}

          {activeRoute === 'friends' && (
            <FriendsView
              friends={friends}
              onAddFriend={(name, handle) => {
                const initials = name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                const created: Friend = {
                  id: `f-${Date.now()}`,
                  name,
                  handle: handle.startsWith('@') ? handle : `@${handle}`,
                  initials: initials || 'FR',
                  status: 'online',
                  activity: 'Just connected on WATCHWAVE',
                  mutualMovies: 7,
                };
                setFriends((prev) => [created, ...prev]);
                showToast('Friend Added', `${created.name} (${created.handle})`, 'MOCK');
              }}
              onInvite={(friend) =>
                showToast(
                  `Watch Invite Sent`,
                  `Notified ${friend.name} to join your theater`
                )
              }
            />
          )}

          {activeRoute === 'profile' && (
            <ProfileView
              user={currentUser}
              movies={movies}
              reviews={reviews}
              watchlistCount={watchlistIds.length}
              onEditSettings={() => setActiveRoute('settings')}
            />
          )}

          {activeRoute === 'settings' && (
            <SettingsView
              user={currentUser}
              onSave={(updated) => {
                setCurrentUser((prev) => ({ ...prev, ...updated }));
                showToast(
                  'Preferences Saved',
                  'Account & device defaults updated',
                  'FRONTEND PREVIEW'
                );
              }}
            />
          )}
        </main>
      </div>

      {/* ====================================================================
          CREATE WATCH PARTY MODAL
         ==================================================================== */}
      {isCreateModalOpen && (
        <CreateWatchPartyModal
          movies={movies}
          defaultMovieId={createModalMovieId}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {/* ====================================================================
          TOAST NOTIFICATION STACK
         ==================================================================== */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ============================================================================
// 5. DASHBOARD VIEW
// ============================================================================

const DashboardView: React.FC<{
  movies: Movie[];
  rooms: WatchRoom[];
  friends: Friend[];
  reviews: Review[];
  watchlistIds: string[];
  onCreateParty: () => void;
  onStartMovieParty: (movieId: string) => void;
  onToggleWatchlist: (movieId: string) => void;
  onJoinRoom: (roomId: string) => void;
  onInviteFriend: (friend: Friend) => void;
  onNavigate: (route: PageRoute) => void;
  onOpenMovieReview: (movieId: string) => void;
}> = ({
  movies,
  rooms,
  friends,
  reviews,
  watchlistIds,
  onCreateParty,
  onStartMovieParty,
  onToggleWatchlist,
  onJoinRoom,
  onInviteFriend,
  onNavigate,
  onOpenMovieReview,
}) => {
  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const isFeaturedSaved = watchlistIds.includes(featuredMovie.id);
  const recentlyWatched = movies.filter((m) => m.watchedDate);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Bar */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA] mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E50924]" />
            Private Cinema Lobby
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Good evening.
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Your next movie night starts here.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateParty}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-sm font-semibold transition-all shadow-lg shadow-black/40 cursor-pointer"
        >
          <Plus size={18} />
          Create Watch Party
        </button>
      </section>

      {/* Featured Movie Cinematic Hero */}
      <section className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101010] min-h-[360px] sm:min-h-[420px] flex items-end">
        <CinemaArtwork
          src={featuredMovie.backdropUrl}
          alt={featuredMovie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Multi-layer Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#E50924] text-white font-semibold tracking-wider uppercase text-[10px]">
              Featured Premiere
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.08] backdrop-blur-md border border-white/10 text-[#D4D4D8]">
              {featuredMovie.genres.join(' • ')}
            </span>
            <span className="flex items-center gap-1 text-[#A1A1AA]">
              <Clock size={13} />
              {featuredMovie.duration}
            </span>
            <span className="px-2 py-0.5 rounded border border-white/15 text-[11px] text-[#A1A1AA]">
              {featuredMovie.maturityRating}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {featuredMovie.title}
          </h2>

          <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed line-clamp-3">
            {featuredMovie.synopsis}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onStartMovieParty(featuredMovie.id)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-sm font-semibold transition-all cursor-pointer"
            >
              <Play size={16} className="fill-white" />
              Start Watch Party
            </button>

            <button
              type="button"
              onClick={() => onToggleWatchlist(featuredMovie.id)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-md border border-white/15 text-white text-sm font-medium transition-all cursor-pointer"
            >
              {isFeaturedSaved ? (
                <>
                  <Check size={16} className="text-[#E50924]" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add to Watchlist
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Active Watch Rooms + Friends Online Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Watch Rooms (2 cols) */}
        <section className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-semibold text-white">
                Active Watch Rooms
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[#A1A1AA]">
                {rooms.length} Live
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('rooms')}
              className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
            >
              Open Theater <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => {
              const movie = movies.find((m) => m.id === room.movieId);
              return (
                <div
                  key={room.id}
                  className="group rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 hover:border-white/25 overflow-hidden transition-all flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden bg-[#101010]">
                    <CinemaArtwork
                      src={room.thumbnailUrl}
                      alt={room.name}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-black/30 to-transparent" />

                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-semibold tracking-wider uppercase text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E50924] animate-pulse" />
                      Live
                    </div>

                    {/* Participant Count */}
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-[#D4D4D8]">
                      <Users size={12} />
                      {room.participants.length} watching
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <div className="text-[11px] uppercase tracking-wider text-[#A1A1AA] truncate">
                        {movie?.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h4 className="text-base font-semibold text-white group-hover:text-white">
                        {room.name}
                      </h4>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Hosted by <span className="text-white">{room.hostName}</span> •{' '}
                        {room.privacy}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex -space-x-2">
                        {room.participants.slice(0, 4).map((p) => (
                          <div
                            key={p.id}
                            title={p.name}
                            className="h-7 w-7 rounded-full bg-[#1A1A1A] border border-white/20 flex items-center justify-center text-[10px] font-semibold text-white"
                          >
                            {p.avatarInitials}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => onJoinRoom(room.id)}
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#E50924] text-white text-xs font-semibold border border-white/10 hover:border-[#E50924] transition-all cursor-pointer"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Friends Online Panel (1 col) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Friends Online</h3>
            <button
              type="button"
              onClick={() => onNavigate('friends')}
              className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
            >
              Manage <ChevronRight size={14} />
            </button>
          </div>

          <div className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-4 space-y-3">
            {friends
              .filter((f) => f.status !== 'offline')
              .map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-[#161616] border border-white/15 flex items-center justify-center text-xs font-bold text-white">
                        {friend.initials}
                      </div>
                      {/* Strictly Monochrome/Crimson status dot */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#101010] ${
                          friend.status === 'watching'
                            ? 'bg-[#E50924]'
                            : 'bg-white'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {friend.name}
                      </div>
                      <div className="text-[11px] text-[#A1A1AA] truncate">
                        {friend.activity}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInviteFriend(friend)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-[11px] font-medium text-white transition-colors cursor-pointer"
                  >
                    Invite
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Recently Watched Together */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Recently Watched Together
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('discover')}
            className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
          >
            Browse Catalog <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyWatched.map((movie) => (
            <div
              key={movie.id}
              className="group rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 hover:border-white/25 overflow-hidden transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#101010]">
                <CinemaArtwork
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-[11px] text-[#D4D4D8] bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                  Watched {movie.watchedDate}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    {movie.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <StarRating rating={movie.groupRating} size={14} />
                    <span className="text-xs font-semibold text-white">
                      {movie.groupRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onOpenMovieReview(movie.id)}
                    className="flex-1 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-medium text-[#D4D4D8] hover:text-white transition-colors cursor-pointer"
                  >
                    Rate &amp; Review
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartMovieParty(movie.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#E50924]/15 hover:bg-[#E50924] border border-[#E50924]/30 text-[11px] font-semibold text-white transition-colors cursor-pointer"
                  >
                    Rewatch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Reviews</h3>
          <button
            type="button"
            onClick={() => onNavigate('reviews')}
            className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
          >
            All Reviews <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#E50924]">
                    {rev.movieTitle}
                  </span>
                  <StarRating rating={rev.rating} size={13} />
                </div>

                <p className="text-sm text-[#D4D4D8] leading-relaxed line-clamp-3">
                  {rev.hasSpoilers
                    ? 'Spoiler-protected review — open Reviews tab to reveal.'
                    : `“${rev.content}”`}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#1A1A1A] border border-white/15 flex items-center justify-center text-[10px] font-bold text-white">
                    {rev.reviewerInitials}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">
                      {rev.reviewerName}
                    </div>
                    <div className="text-[10px] text-[#686868]">
                      {rev.reviewerHandle}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#686868]">{rev.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// 6. FLAGSHIP WATCH ROOM EXPERIENCE (Theater + Explicit Device Permissions)
// ============================================================================

interface FloatingReaction {
  id: string;
  symbol: string;
  leftPercent: number;
}

const WatchRoomExperience: React.FC<{
  rooms: WatchRoom[];
  activeRoomId: string;
  movies: Movie[];
  currentUser: { name: string; handle: string; initials: string };
  onSelectRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onCreateRoom: () => void;
  onSendMessage: (roomId: string, text: string) => void;
  showToast: (title: string, desc?: string, badge?: string) => void;
}> = ({
  rooms,
  activeRoomId,
  movies,
  currentUser,
  onSelectRoom,
  onLeaveRoom,
  onCreateRoom,
  onSendMessage,
  showToast,
}) => {
  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const movie = movies.find((m) => m.id === currentRoom.movieId) || movies[0];

  // Video player simulation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(2538); // 42:18
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Explicit permission-gated Camera & Mic state (OFF by default)
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [permissionModalDevice, setPermissionModalDevice] = useState<
    'camera' | 'microphone' | null
  >(null);

  // Chat & Floating Reactions
  const [chatInput, setChatInput] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Playback ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((t) => (t + 1 >= movie.durationSeconds ? 0 : t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, movie.durationSeconds]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom.messages.length]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(
      s
    ).padStart(2, '0')}`;
  };

  const triggerReaction = (symbol: string) => {
    const id = `react-${Date.now()}-${Math.random()}`;
    const leftPercent = 15 + Math.floor(Math.random() * 70);
    setFloatingReactions((prev) => [...prev, { id, symbol, leftPercent }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  };

  const handleCameraButtonClick = () => {
    if (cameraEnabled) {
      setCameraEnabled(false);
      showToast('Camera Turned Off', 'Local video stream paused');
    } else {
      setPermissionModalDevice('camera');
    }
  };

  const handleMicButtonClick = () => {
    if (micEnabled) {
      setMicEnabled(false);
      showToast('Microphone Muted', 'Local audio muted');
    } else {
      setPermissionModalDevice('microphone');
    }
  };

  const confirmDevicePermission = () => {
    if (permissionModalDevice === 'camera') {
      setCameraEnabled(true);
      showToast(
        'Camera Enabled (Simulated Preview)',
        'Explicit permission granted • Ready for LiveKit',
        'DEVICE ACTIVE'
      );
    } else if (permissionModalDevice === 'microphone') {
      setMicEnabled(true);
      showToast(
        'Microphone Enabled',
        'Voice channel active • Ready for LiveKit',
        'DEVICE ACTIVE'
      );
    }
    setPermissionModalDevice(null);
  };

  // Merge local user's device state into participant grid
  const displayParticipants: Participant[] = useMemo(() => {
    const hasSelf = currentRoom.participants.some((p) => p.isSelf);
    const list = hasSelf
      ? currentRoom.participants
      : [
          ...currentRoom.participants,
          {
            id: 'self-local',
            name: `${currentUser.name} (You)`,
            handle: currentUser.handle,
            avatarInitials: currentUser.initials,
            cameraOn: cameraEnabled,
            micOn: micEnabled,
            isSelf: true,
          },
        ];
    return list.map((p) =>
      p.isSelf
        ? {
            ...p,
            name: `${currentUser.name} (You)`,
            cameraOn: cameraEnabled,
            micOn: micEnabled,
            isSpeaking: micEnabled,
          }
        : p
    );
  }, [currentRoom.participants, currentUser, cameraEnabled, micEnabled]);

  const progressPercent = Math.min(
    100,
    (currentTime / movie.durationSeconds) * 100
  );

  return (
    <div className="space-y-5">
      {/* Room Switcher Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {rooms.map((r) => {
            const active = r.id === currentRoom.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRoom(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 border transition-all cursor-pointer ${
                  active
                    ? 'bg-white/[0.08] text-white border-[#E50924]/60'
                    : 'bg-white/[0.03] text-[#A1A1AA] border-white/10 hover:text-white'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E50924]" />
                {r.name}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onCreateRoom}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.03] hover:bg-white/[0.08] text-[#A1A1AA] hover:text-white border border-dashed border-white/15 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> New Room
          </button>
        </div>

        <button
          type="button"
          onClick={onLeaveRoom}
          className="px-4 py-2 rounded-xl bg-[#E50924]/15 hover:bg-[#E50924] border border-[#E50924]/40 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          Leave Room
        </button>
      </div>

      {/* Main Theater Grid: Video + Participants (Left 8 cols) | Social Chat (Right 4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-5">
          {/* Primary Cinema Player Container */}
          <div className="rounded-2xl bg-[#000000] border border-white/15 overflow-hidden shadow-2xl">
            {/* Top Cinema Status Bar */}
            <div className="px-4 py-3 bg-[#101010] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E50924] text-white text-[10px] font-bold tracking-wider uppercase">
                  <Radio size={11} className="animate-pulse" />
                  Live Sync
                </span>
                <h2 className="text-sm font-semibold text-white">
                  {currentRoom.name} —{' '}
                  <span className="text-[#A1A1AA] font-normal">{movie.title}</span>
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#686868]">
                SIMULATED STREAM • 1080P MASTER
              </span>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video bg-black overflow-hidden select-none">
              <CinemaArtwork
                src={movie.backdropUrl}
                alt={movie.title}
                className={`w-full h-full transition-transform duration-[4000ms] ${
                  isPlaying ? 'scale-105' : 'scale-100 opacity-75'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

              {/* Subtle Film Letterbox & Center Playback Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                {!isPlaying && (
                  <div className="px-5 py-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center gap-3">
                    <Pause size={18} className="text-[#E50924]" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-white">
                      Playback Paused for Room
                    </span>
                  </div>
                )}
              </div>

              {/* Cinema Subtitle / Scene Caption Simulation */}
              <div className="absolute bottom-14 inset-x-0 flex justify-center px-4 pointer-events-none">
                <div className="px-4 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-[#D4D4D8] tracking-wide">
                  {isPlaying
                    ? `[RELAY STATION 04]: “The signal wasn't sent from Earth... it's an echo.”`
                    : `[PAUSED AT ${formatTime(currentTime)}]`}
                </div>
              </div>

              {/* Floating Emoji Reactions Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingReactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.leftPercent}%` }}
                    className="absolute bottom-16 text-2xl animate-bounce opacity-90 drop-shadow"
                  >
                    {r.symbol}
                  </div>
                ))}
              </div>
            </div>

            {/* Playback Timeline & Controls Bar */}
            <div className="p-4 bg-[#101010] border-t border-white/10 space-y-3">
              {/* Scrubbing Progress Bar */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={movie.durationSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  aria-label="Playback timeline"
                  className="w-full accent-[#E50924] h-1.5 bg-white/15 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-[#686868]">
                    {Math.round(progressPercent)}% watched
                  </span>
                  <span>{formatTime(movie.durationSeconds)}</span>
                </div>
              </div>

              {/* Transport & Device Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Left: Play/Pause + Volume */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying((p) => !p);
                      showToast(
                        !isPlaying ? 'Playback Resumed' : 'Playback Paused',
                        'Synced across room participants'
                      );
                    }}
                    className="h-10 w-10 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} className="fill-white ml-0.5" />
                    )}
                  </button>

                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted((m) => !m)}
                      className="text-[#D4D4D8] hover:text-white cursor-pointer"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={16} className="text-[#E50924]" />
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                      }}
                      aria-label="Volume"
                      className="w-20 accent-[#E50924] h-1 bg-white/15 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Center: Explicit Permission Camera & Microphone Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMicButtonClick}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                      micEnabled
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.045] text-[#D4D4D8] border-white/10 hover:border-white/25'
                    }`}
                  >
                    {micEnabled ? <Mic size={15} /> : <MicOff size={15} />}
                    {micEnabled ? 'Mic On' : 'Mic Off'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCameraButtonClick}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${
                      cameraEnabled
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.045] text-[#D4D4D8] border-white/10 hover:border-white/25'
                    }`}
                  >
                    {cameraEnabled ? <Video size={15} /> : <VideoOff size={15} />}
                    {cameraEnabled ? 'Cam On' : 'Cam Off'}
                  </button>
                </div>

                {/* Right: Emoji Reaction Triggers & Fullscreen */}
                <div className="flex items-center gap-1.5">
                  {['❤️', '🔥', '😱', '👏', '🎬'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => triggerReaction(emoji)}
                      className="h-9 w-9 rounded-xl bg-white/[0.045] hover:bg-white/[0.12] border border-white/10 text-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                      title="Send reaction"
                    >
                      {emoji}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Theater Fullscreen Mode',
                        'Press Esc to exit theater focus'
                      )
                    }
                    className="h-9 w-9 rounded-xl bg-white/[0.045] hover:bg-white/[0.12] border border-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center ml-1 cursor-pointer"
                    aria-label="Toggle fullscreen"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Participant Video Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Theater Participants ({displayParticipants.length})
              </h3>
              <span className="text-[11px] text-[#686868]">
                Cameras &amp; mics require explicit user permission
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {displayParticipants.map((p) => (
                <div
                  key={p.id}
                  className={`relative aspect-video rounded-xl bg-[#101010] border overflow-hidden flex flex-col items-center justify-center p-3 transition-all ${
                    p.isSpeaking
                      ? 'border-[#E50924] shadow-[0_0_0_1px_rgba(229,9,36,0.4)]'
                      : 'border-white/10'
                  }`}
                >
                  {p.cameraOn ? (
                    <div className="absolute inset-0 bg-[#161616] flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-sm font-bold text-white animate-pulse">
                        {p.avatarInitials}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] mt-2">
                        Camera Feed Active (Preview)
                      </span>
                    </div>
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-xs font-bold text-white">
                      {p.avatarInitials}
                    </div>
                  )}

                  {/* Name & Status Pill */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10">
                    <span className="text-[11px] font-medium text-white truncate flex items-center gap-1">
                      {p.isHost && (
                        <Crown size={11} className="text-[#E50924] shrink-0" />
                      )}
                      {p.name}
                    </span>
                    {p.micOn ? (
                      <Mic size={11} className="text-white shrink-0" />
                    ) : (
                      <MicOff size={11} className="text-[#686868] shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Social Chat Sidebar (4 cols) */}
        <div className="xl:col-span-4 rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 flex flex-col h-[580px]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Room Chat</h3>
              <p className="text-[11px] text-[#686868]">
                Live watch party commentary
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[#A1A1AA]">
              {displayParticipants.length} Online
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {currentRoom.messages.map((msg) =>
              msg.isSystem ? (
                <div
                  key={msg.id}
                  className="text-[11px] text-[#686868] bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-center"
                >
                  {msg.text}
                </div>
              ) : (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-white">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-[#686868]">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#D4D4D8] bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              )
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              onSendMessage(currentRoom.id, chatInput.trim());
              setChatInput('');
            }}
            className="p-3 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send a message to the room..."
              className="flex-1 bg-[#101010] border border-white/10 focus:border-white/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686868] focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Explicit Device Permission Modal */}
      {permissionModalDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#101010] border border-white/15 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#E50924]/15 border border-[#E50924]/40 flex items-center justify-center text-[#E50924]">
                {permissionModalDevice === 'camera' ? (
                  <Video size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white capitalize">
                  Enable {permissionModalDevice}?
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Explicit hardware permission required
                </p>
              </div>
            </div>

            <p className="text-xs text-[#D4D4D8] leading-relaxed bg-white/[0.03] border border-white/10 rounded-xl p-3.5">
              WATCHWAVE never activates your camera or microphone automatically.
              Granting access enables your local preview tile in this watch room
              (prepared for LiveKit WebRTC media tracks).
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPermissionModalDevice(null)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white cursor-pointer"
              >
                Keep Off
              </button>
              <button
                type="button"
                onClick={confirmDevicePermission}
                className="px-4 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-xs font-semibold text-white cursor-pointer"
              >
                Allow &amp; Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 7. DEDICATED REVIEWS SYSTEM VIEW
// ============================================================================

const ReviewsView: React.FC<{
  movies: Movie[];
  selectedMovieId: string;
  onSelectMovie: (id: string) => void;
  reviews: Review[];
  currentUser: { name: string; handle: string; initials: string };
  onAddReview: (review: Review) => void;
}> = ({
  movies,
  selectedMovieId,
  onSelectMovie,
  reviews,
  currentUser,
  onAddReview,
}) => {
  const movie = movies.find((m) => m.id === selectedMovieId) || movies[0];

  // Form state
  const [rating, setRating] = useState<number>(4.5);
  const [reviewText, setReviewText] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);

  // Filter & Sort state
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'no-spoilers'>(
    'all'
  );
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>(
    {}
  );

  const movieReviews = useMemo(() => {
    let list = reviews.filter((r) => r.movieId === movie.id);
    if (filterMode === 'verified') {
      list = list.filter((r) => r.verifiedSession);
    } else if (filterMode === 'no-spoilers') {
      list = list.filter((r) => !r.hasSpoilers);
    }
    if (sortBy === 'highest') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list = [...list].sort((a, b) => a.rating - b.rating);
    }
    return list;
  }, [reviews, movie.id, sortBy, filterMode]);

  const averageRating = useMemo(() => {
    const allForMovie = reviews.filter((r) => r.movieId === movie.id);
    if (allForMovie.length === 0) return movie.groupRating;
    const sum = allForMovie.reduce((acc, r) => acc + r.rating, 0);
    return sum / allForMovie.length;
  }, [reviews, movie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    onAddReview({
      id: `rev-${Date.now()}`,
      movieId: movie.id,
      movieTitle: movie.title,
      reviewerName: currentUser.name,
      reviewerHandle: currentUser.handle,
      reviewerInitials: currentUser.initials,
      rating,
      content: reviewText.trim(),
      hasSpoilers,
      verifiedSession: true,
      createdAt: 'Just now',
      likes: 1,
    });
    setReviewText('');
    setHasSpoilers(false);
  };

  return (
    <div className="space-y-8">
      {/* Movie Subject Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Cinema Reviews</h1>
          <p className="text-sm text-[#A1A1AA]">
            Post-screening critiques linked to watch party sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {movies.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMovie(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                m.id === movie.id
                  ? 'bg-[#E50924] text-white border-[#E50924]'
                  : 'bg-white/[0.045] text-[#A1A1AA] border-white/10 hover:text-white'
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Overview + Write Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Selected Movie Card & Group Average */}
        <div className="lg:col-span-5 rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-6 flex flex-col sm:flex-row lg:flex-col gap-5">
          <div className="w-full sm:w-40 lg:w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/10 shrink-0">
            <CinemaArtwork
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full"
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">
                {movie.year} • {movie.duration}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#D4D4D8]">
                Dir. {movie.director}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white">{movie.title}</h2>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {movie.synopsis}
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#686868]">
                  Group Rating
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={averageRating} size={16} />
                  <span className="text-sm font-bold text-white">
                    {averageRating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#A1A1AA]">
                {reviews.filter((r) => r.movieId === movie.id).length} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Rating & Review Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Write a Review for {movie.title}
              </h3>
              <p className="text-xs text-[#686868] mt-0.5">
                Click left or right side of a star for half-star precision
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#D4D4D8]">
              Verified Watch Session
            </span>
          </div>

          {/* Interactive Half-Star Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#101010] border border-white/10">
            <span className="text-xs font-medium text-[#D4D4D8]">
              Your Score
            </span>
            <div className="flex items-center gap-3">
              <StarRating
                rating={rating}
                interactive
                size={24}
                onChange={(val) => setRating(val)}
              />
              <span className="text-base font-bold text-white w-12 text-right">
                {rating.toFixed(1)} ★
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
              Your Critique
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts on cinematography, pacing, or favorite watch room moments..."
              className="w-full rounded-xl bg-[#101010] border border-white/10 focus:border-white/25 p-3.5 text-sm text-white placeholder-[#686868] focus:outline-none"
            />
          </div>

          {/* Spoiler Toggle & Submit */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={() => setHasSpoilers((s) => !s)}
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                hasSpoilers
                  ? 'bg-[#E50924]/15 border-[#E50924] text-white'
                  : 'bg-white/[0.04] border-white/10 text-[#A1A1AA] hover:text-white'
              }`}
            >
              <AlertCircle size={14} className={hasSpoilers ? 'text-[#E50924]' : ''} />
              Contains Plot Spoilers: {hasSpoilers ? 'ON' : 'OFF'}
            </button>

            <button
              type="submit"
              disabled={!reviewText.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>

      {/* Reviews Feed + Sorting & Filtering */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'all', label: 'All Reviews' },
                { id: 'verified', label: 'Verified Sessions' },
                { id: 'no-spoilers', label: 'Hide Spoilers' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  filterMode === f.id
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.04] text-[#A1A1AA] border-white/10 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal size={14} className="text-[#686868]" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')
              }
              aria-label="Sort reviews"
              className="bg-[#101010] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="newest">Sort: Most Recent</option>
              <option value="highest">Sort: Highest Rated</option>
              <option value="lowest">Sort: Lowest Rated</option>
            </select>
          </div>
        </div>

        {movieReviews.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-10 text-center text-sm text-[#686868]">
            No reviews match the current filter for {movie.title}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {movieReviews.map((rev) => {
              const isRevealed = revealedSpoilers[rev.id];
              return (
                <div
                  key={rev.id}
                  className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-[#1A1A1A] border border-white/15 flex items-center justify-center text-xs font-bold text-white">
                        {rev.reviewerInitials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          {rev.reviewerName}
                          {rev.verifiedSession && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[#A1A1AA] font-normal">
                              Watched Together
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#686868]">
                          {rev.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} size={14} />
                      <span className="text-xs font-bold text-white">
                        {rev.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {rev.hasSpoilers && !isRevealed ? (
                    <div className="p-3.5 rounded-xl bg-[#101010] border border-[#E50924]/30 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#A1A1AA]">
                        Contains plot spoilers for {rev.movieTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedSpoilers((prev) => ({
                            ...prev,
                            [rev.id]: true,
                          }))
                        }
                        className="px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-medium text-white shrink-0 cursor-pointer"
                      >
                        Reveal
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-[#D4D4D8] leading-relaxed">
                      {rev.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 8. DISCOVER MOVIES VIEW
// ============================================================================

const DiscoverView: React.FC<{
  movies: Movie[];
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
  onStartParty: (id: string) => void;
  onReviewMovie: (id: string) => void;
}> = ({
  movies,
  watchlistIds,
  onToggleWatchlist,
  onStartParty,
  onReviewMovie,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const genres = ['All', 'Sci-Fi', 'Neo-Noir', 'Thriller', 'Drama', 'Documentary'];

  const filtered = useMemo(() => {
    if (selectedGenre === 'All') return movies;
    return movies.filter((m) => m.genres.includes(selectedGenre));
  }, [movies, selectedGenre]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Discover Cinema</h1>
          <p className="text-sm text-[#A1A1AA]">
            Curated titles optimized for synchronized watch rooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                selectedGenre === g
                  ? 'bg-[#E50924] text-white border-[#E50924]'
                  : 'bg-white/[0.045] text-[#A1A1AA] border-white/10 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((movie) => {
          const saved = watchlistIds.includes(movie.id);
          return (
            <div
              key={movie.id}
              className="group rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 hover:border-white/25 overflow-hidden flex flex-col transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-[#101010]">
                <CinemaArtwork
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[10px] text-[#D4D4D8]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(movie.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:border-[#E50924] transition-colors cursor-pointer"
                  title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {saved ? (
                    <Check size={15} className="text-[#E50924]" />
                  ) : (
                    <Plus size={15} />
                  )}
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                    <span>
                      {movie.year} • {movie.duration}
                    </span>
                    <span className="flex items-center gap-1 text-white font-semibold">
                      <Star size={12} className="text-[#E50924] fill-[#E50924]" />
                      {movie.groupRating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onStartParty(movie.id)}
                    className="flex-1 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play size={13} className="fill-white" />
                    Start Party
                  </button>
                  <button
                    type="button"
                    onClick={() => onReviewMovie(movie.id)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-[#D4D4D8] hover:text-white cursor-pointer"
                  >
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 9. WATCHLIST, FRIENDS, PROFILE & SETTINGS VIEWS
// ============================================================================

const WatchlistView: React.FC<{
  movies: Movie[];
  onRemove: (id: string) => void;
  onStartParty: (id: string) => void;
  onExplore: () => void;
}> = ({ movies, onRemove, onStartParty, onExplore }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white">Your Watchlist</h1>
        <p className="text-sm text-[#A1A1AA]">
          Saved films queued for upcoming watch nights ({movies.length}).
        </p>
      </div>
    </div>

    {movies.length === 0 ? (
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-12 text-center space-y-4">
        <Bookmark size={28} className="mx-auto text-[#686868]" />
        <div className="text-base font-medium text-white">
          Your watchlist is empty
        </div>
        <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
          Save titles from Discover or the Dashboard to organize your next social
          screening.
        </p>
        <button
          type="button"
          onClick={onExplore}
          className="px-5 py-2.5 rounded-xl bg-[#E50924] text-white text-xs font-semibold cursor-pointer"
        >
          Browse Movies
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {movies.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 overflow-hidden flex flex-col"
          >
            <div className="relative h-44 bg-[#101010]">
              <CinemaArtwork
                src={m.backdropUrl}
                alt={m.title}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs text-[#A1A1AA]">
                  {m.year} • {m.duration}
                </div>
                <h3 className="text-base font-bold text-white mt-1">{m.title}</h3>
                <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-2">
                  {m.synopsis}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onStartParty(m.id)}
                  className="flex-1 py-2 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-xs font-semibold cursor-pointer"
                >
                  Start Watch Party
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(m.id)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-[#A1A1AA] hover:text-white cursor-pointer"
                  title="Remove from Watchlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const FriendsView: React.FC<{
  friends: Friend[];
  onAddFriend: (name: string, handle: string) => void;
  onInvite: (friend: Friend) => void;
}> = ({ friends, onAddFriend, onInvite }) => {
  const [tab, setTab] = useState<'all' | 'online'>('all');
  const [nameInput, setNameInput] = useState('');
  const [handleInput, setHandleInput] = useState('');

  const displayed =
    tab === 'online'
      ? friends.filter((f) => f.status !== 'offline')
      : friends;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Friends &amp; Circle</h1>
          <p className="text-sm text-[#A1A1AA]">
            See who is watching and send instant theater invites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
              tab === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-white/[0.04] text-[#A1A1AA] border-white/10'
            }`}
          >
            All ({friends.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('online')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
              tab === 'online'
                ? 'bg-white text-black border-white'
                : 'bg-white/[0.04] text-[#A1A1AA] border-white/10'
            }`}
          >
            Online ({friends.filter((f) => f.status !== 'offline').length})
          </button>
        </div>
      </div>

      {/* Add Friend Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!nameInput.trim() || !handleInput.trim()) return;
          onAddFriend(nameInput.trim(), handleInput.trim());
          setNameInput('');
          setHandleInput('');
        }}
        className="rounded-2xl bg-white/[0.045] border border-white/10 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Friend display name (e.g. Claire Vance)"
          className="flex-1 bg-[#101010] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#686868] focus:outline-none"
        />
        <input
          type="text"
          value={handleInput}
          onChange={(e) => setHandleInput(e.target.value)}
          placeholder="@handle"
          className="sm:w-48 bg-[#101010] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#686868] focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus size={14} /> Add Friend
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((friend) => (
          <div
            key={friend.id}
            className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-xl bg-[#161616] border border-white/15 flex items-center justify-center text-sm font-bold text-white">
                  {friend.initials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#101010] ${
                    friend.status === 'watching'
                      ? 'bg-[#E50924]'
                      : friend.status === 'online'
                      ? 'bg-white'
                      : 'bg-[#686868]'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {friend.name}
                </div>
                <div className="text-[11px] text-[#686868]">{friend.handle}</div>
                <div className="text-[11px] text-[#A1A1AA] truncate mt-1">
                  {friend.activity}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onInvite(friend)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-[#E50924] border border-white/10 hover:border-[#E50924] text-xs font-medium text-white transition-colors shrink-0 cursor-pointer"
            >
              Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileView: React.FC<{
  user: { name: string; handle: string; email: string; initials: string; bio: string };
  movies: Movie[];
  reviews: Review[];
  watchlistCount: number;
  onEditSettings: () => void;
}> = ({ user, movies, reviews, watchlistCount, onEditSettings }) => (
  <div className="space-y-6">
    <div className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 rounded-2xl bg-[#161616] border border-white/20 flex items-center justify-center text-2xl font-bold text-white">
          {user.initials}
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E50924]/15 border border-[#E50924]/40 text-[10px] font-semibold uppercase tracking-wider text-white">
              Founding Member
            </span>
          </div>
          <div className="text-xs text-[#686868] mt-0.5">
            {user.handle} • {user.email}
          </div>
          <p className="text-sm text-[#D4D4D8] mt-2">{user.bio}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditSettings}
        className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white self-start sm:self-center cursor-pointer"
      >
        Edit Profile
      </button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Watch Parties Joined', value: '42' },
        { label: 'Hours Streamed Together', value: '96h' },
        { label: 'Reviews Written', value: `${reviews.length}` },
        { label: 'Saved in Watchlist', value: `${watchlistCount}` },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white/[0.045] border border-white/10 p-5"
        >
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-xs text-[#A1A1AA] mt-1">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="space-y-3">
      <h2 className="text-base font-semibold text-white">Favorite Screening Picks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {movies.slice(0, 3).map((m) => (
          <div
            key={m.id}
            className="rounded-xl bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5"
          >
            <CinemaArtwork
              src={m.posterUrl}
              alt={m.title}
              className="w-12 h-16 rounded-lg border border-white/10 shrink-0"
            />
            <div>
              <div className="text-sm font-semibold text-white">{m.title}</div>
              <div className="text-xs text-[#A1A1AA]">{m.year}</div>
              <div className="mt-1">
                <StarRating rating={m.groupRating} size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsView: React.FC<{
  user: { name: string; handle: string; email: string; bio: string };
  onSave: (updated: { name: string; bio: string }) => void;
}> = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [autoMuteOnJoin, setAutoMuteOnJoin] = useState(true);
  const [cameraOffOnJoin, setCameraOffOnJoin] = useState(true);
  const [friendsOnlyDefault, setFriendsOnlyDefault] = useState(true);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-[#A1A1AA]">
          Configure account identity, theater privacy, and media hardware defaults.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, bio });
        }}
        className="space-y-6"
      >
        <div className="rounded-2xl bg-white/[0.045] border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Profile Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[#101010] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full rounded-xl bg-[#101010]/60 border border-white/10 px-3.5 py-2.5 text-sm text-[#686868]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#A1A1AA] mb-1.5">Bio</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl bg-[#101010] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.045] border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Watch Room &amp; Device Permissions
          </h2>
          {[
            {
              label: 'Join watch rooms with microphone muted',
              desc: 'Requires explicit click and permission before transmitting voice.',
              value: autoMuteOnJoin,
              toggle: () => setAutoMuteOnJoin((v) => !v),
            },
            {
              label: 'Join watch rooms with camera disabled',
              desc: 'Prevents automatic webcam activation on room entry.',
              value: cameraOffOnJoin,
              toggle: () => setCameraOffOnJoin((v) => !v),
            },
            {
              label: 'Default new watch parties to Friends Only',
              desc: 'Restricts discovery of newly created rooms to your circle.',
              value: friendsOnlyDefault,
              toggle: () => setFriendsOnlyDefault((v) => !v),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-2"
            >
              <div>
                <div className="text-sm font-medium text-white">{item.label}</div>
                <div className="text-xs text-[#686868]">{item.desc}</div>
              </div>
              <button
                type="button"
                onClick={item.toggle}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  item.value ? 'bg-[#E50924]' : 'bg-white/15'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    item.value ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Backend Readiness Status */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-[#E50924]" />
            <div>
              <div className="text-xs font-semibold text-white">
                Infrastructure Integration Hooks
              </div>
              <div className="text-[11px] text-[#686868]">
                Ready for Supabase Auth/DB &amp; LiveKit SFU WebRTC tokens.
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-[#A1A1AA] uppercase tracking-wider">
            Frontend Milestone
          </span>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// 10. LANDING PAGE & AUTH VIEWS
// ============================================================================

const LandingView: React.FC<{
  movies: Movie[];
  onEnterApp: () => void;
  onNavigate: (route: PageRoute) => void;
  onStartParty: (movieId: string) => void;
}> = ({ movies, onEnterApp, onNavigate, onStartParty }) => (
  <div className="min-h-screen flex flex-col bg-[#080808]">
    <header className="h-20 px-6 lg:px-12 border-b border-white/10 flex items-center justify-between bg-[#080808]/90 backdrop-blur-xl sticky top-0 z-20">
      <WatchwaveLogo />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="px-4 py-2 rounded-xl text-xs font-medium text-[#D4D4D8] hover:text-white transition-colors cursor-pointer"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={onEnterApp}
          className="px-5 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Open Dashboard
        </button>
      </div>
    </header>

    <main className="flex-1">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 px-6 lg:px-12 overflow-hidden border-b border-white/10">
        <CinemaArtwork
          src={movies[0].backdropUrl}
          alt="Cinema backdrop"
          className="absolute inset-0 w-full h-full opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-[#D4D4D8]">
            <span className="h-2 w-2 rounded-full bg-[#E50924]" />
            Synchronized Cinema &amp; Private Film Clubs
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Cinema is better when the room reacts together.
          </h1>

          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Host frame-accurate watch parties, talk live with spatial voice and
            opt-in video tiles, and archive half-star critiques with your circle.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onEnterApp}
              className="px-7 py-3.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-sm font-semibold inline-flex items-center gap-2.5 transition-all cursor-pointer"
            >
              Launch WATCHWAVE <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="px-7 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-sm font-semibold transition-all cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-6xl mx-auto py-16 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Tv size={20} className="text-[#E50924]" />,
            title: 'Frame-Synced Watch Rooms',
            desc: 'Shared play, pause, and timeline scrubbing keep every guest locked to the exact frame.',
          },
          {
            icon: <Shield size={20} className="text-[#E50924]" />,
            title: 'Permission-First Presence',
            desc: 'Cameras and microphones remain strictly off until you explicitly grant access.',
          },
          {
            icon: <Star size={20} className="text-[#E50924]" />,
            title: 'Post-Screening Reviews',
            desc: 'Rate films in 0.5-star increments with spoiler shields and group averages.',
          },
        ].map((feat) => (
          <div
            key={feat.title}
            className="rounded-2xl bg-white/[0.045] backdrop-blur-md border border-white/10 p-6 space-y-3"
          >
            <div className="h-10 w-10 rounded-xl bg-[#101010] border border-white/10 flex items-center justify-center">
              {feat.icon}
            </div>
            <h3 className="text-base font-semibold text-white">{feat.title}</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </main>
  </div>
);

const AuthView: React.FC<{
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: (email: string, name?: string) => void;
  onBackLanding: () => void;
}> = ({ mode, onSwitchMode, onSuccess, onBackLanding }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.mercer@watchwave.io');
  const [password, setPassword] = useState('••••••••••••');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
      <div className="w-full max-w-md rounded-2xl bg-white/[0.045] backdrop-blur-xl border border-white/10 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <WatchwaveLogo />
          <button
            type="button"
            onClick={onBackLanding}
            className="text-xs text-[#A1A1AA] hover:text-white cursor-pointer"
          >
            Back
          </button>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your theater pass'}
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            {mode === 'login'
              ? 'Sign in to join active watch rooms and your film circle.'
              : 'Frontend preview authentication — ready for Supabase Auth.'}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(email, mode === 'register' ? name || 'Alex Mercer' : undefined);
          }}
          className="space-y-4"
        >
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full rounded-xl bg-[#101010] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[#A1A1AA] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#101010] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A1A1AA] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#101010] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {mode === 'login' ? 'Enter WATCHWAVE' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#A1A1AA]">
          {mode === 'login' ? (
            <>
              New to WATCHWAVE?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="text-white underline hover:text-[#E50924] cursor-pointer"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="text-white underline hover:text-[#E50924] cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 11. CREATE WATCH PARTY MODAL & TOAST SYSTEM
// ============================================================================

const CreateWatchPartyModal: React.FC<{
  movies: Movie[];
  defaultMovieId: string;
  onClose: () => void;
  onCreate: (
    name: string,
    movieId: string,
    privacy: 'Public' | 'Friends Only'
  ) => void;
}> = ({ movies, defaultMovieId, onClose, onCreate }) => {
  const [movieId, setMovieId] = useState(defaultMovieId);
  const [roomName, setRoomName] = useState('');
  const [privacy, setPrivacy] = useState<'Public' | 'Friends Only'>('Friends Only');

  const selectedMovie = movies.find((m) => m.id === movieId) || movies[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#101010] border border-white/15 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Create Watch Party
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Configure your theater room and launch synchronized playback.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(
              roomName || `${selectedMovie.title} Screening`,
              movieId,
              privacy
            );
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Select Feature Film
            </label>
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full rounded-xl bg-[#080808] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none"
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.year} • {m.duration})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={`${selectedMovie.title} Late Night Club`}
              className="w-full rounded-xl bg-[#080808] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-[#686868] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Room Access
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Friends Only', 'Public'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPrivacy(opt)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    privacy === opt
                      ? 'bg-white text-black border-white'
                      : 'bg-[#080808] text-[#A1A1AA] border-white/10 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] text-xs font-medium text-white hover:bg-white/[0.1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#B8071D] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
            >
              <Play size={14} className="fill-white" />
              Launch Watch Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: ToastItem[] }> = ({ toasts }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-2xl bg-[#101010]/95 backdrop-blur-xl border border-white/15 p-4 shadow-2xl flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 size={16} className="text-[#E50924] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">{t.title}</div>
              {t.description && (
                <div className="text-[11px] text-[#A1A1AA] mt-0.5">
                  {t.description}
                </div>
              )}
            </div>
          </div>
          {t.badge && (
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[#A1A1AA] uppercase tracking-wider shrink-0">
              {t.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;