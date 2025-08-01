import { NextRequest, NextResponse } from 'next/server';

interface GamerLookupRequest {
  gamerTag: string;
  platform: 'xbox' | 'playstation' | 'steam';
}

interface GamerLookupResponse {
  platform: string;
  player: {
    gamerTag: string;
    gamerscore?: number;
    level?: number;
    profilePicture?: string;
  };
  totalHours: number;
  totalGames: number;
  qualificationStatus: 'qualified' | 'not_qualified' | 'unknown';
  qualificationReason: string;
  topGames: Array<{
    name: string;
    hoursPlayed: number;
    platform: string;
    achievements?: number;
  }>;
  error?: string;
}

// Cache for API responses (5 minute TTL like your original)
const cache = new Map<string, { data: GamerLookupResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function lookupXboxPlayer(gamerTag: string): Promise<GamerLookupResponse> {
  const apiKey = process.env.OPENXBL_API_KEY;
  
  if (!apiKey) {
    throw new Error('Xbox API key not configured');
  }

  try {
    // Xbox player profile lookup
    const profileResponse = await fetch(`https://xbl.io/api/v2/player/${encodeURIComponent(gamerTag)}`, {
      headers: {
        'X-Authorization': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`Xbox API error: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();

    // Xbox games lookup
    const gamesResponse = await fetch(`https://xbl.io/api/v2/player/${encodeURIComponent(gamerTag)}/games`, {
      headers: {
        'X-Authorization': apiKey,
        'Accept': 'application/json'
      }
    });

    let gamesData = [];
    if (gamesResponse.ok) {
      gamesData = await gamesResponse.json();
    }

    return {
      platform: 'xbox',
      player: {
        gamerTag: profileData.gamerTag || gamerTag,
        gamerscore: profileData.gamerScore || 0,
        profilePicture: profileData.displayPicRaw
      },
      totalHours: 0, // Xbox doesn't provide total hours
      totalGames: gamesData.length || 0,
      qualificationStatus: 'not_qualified',
      qualificationReason: 'Xbox data shows gaming activity but no playtime hours available',
      topGames: gamesData.slice(0, 5).map((game: any) => ({
        name: game.name || 'Unknown Game',
        hoursPlayed: 0, // Xbox limitation
        platform: 'xbox',
        achievements: game.currentAchievements || 0
      }))
    };
  } catch (error) {
    console.error('Xbox lookup error:', error);
    throw error;
  }
}

async function lookupSteamPlayer(gamerTag: string): Promise<GamerLookupResponse> {
  const apiKey = process.env.STEAM_API_KEY;
  
  if (!apiKey) {
    throw new Error('Steam API key not configured');
  }

  try {
    // Steam ID lookup by vanity name
    const idResponse = await fetch(
      `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(gamerTag)}`
    );
    
    const idData = await idResponse.json();
    
    if (idData.response.success !== 1) {
      throw new Error('Steam user not found');
    }

    const steamId = idData.response.steamid;

    // Get player summary
    const playerResponse = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
    );
    
    const playerData = await playerResponse.json();
    const player = playerData.response.players[0];

    // Get owned games
    const gamesResponse = await fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`
    );
    
    let gamesData = { response: { games: [] } };
    if (gamesResponse.ok) {
      gamesData = await gamesResponse.json();
    }

    const games = gamesData.response.games || [];
    const totalMinutes = games.reduce((sum: number, game: any) => sum + (game.playtime_forever || 0), 0);
    
    return {
      platform: 'steam',
      player: {
        gamerTag: player.personaname || gamerTag,
        profilePicture: player.avatarfull
      },
      totalHours: Math.round(totalMinutes / 60),
      totalGames: games.length,
      qualificationStatus: totalMinutes > 2000 ? 'qualified' : 'not_qualified', // 33+ hours
      qualificationReason: `Steam shows ${Math.round(totalMinutes / 60)} total hours of gaming`,
      topGames: games
        .sort((a: any, b: any) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
        .slice(0, 5)
        .map((game: any) => ({
          name: game.name || 'Unknown Game',
          hoursPlayed: Math.round((game.playtime_forever || 0) / 60),
          platform: 'steam'
        }))
    };
  } catch (error) {
    console.error('Steam lookup error:', error);
    throw error;
  }
}

async function lookupPlayStationPlayer(gamerTag: string): Promise<GamerLookupResponse> {
  // PlayStation integration would require PSN API setup
  // For now, return a placeholder that explains the requirement
  return {
    platform: 'playstation',
    player: {
      gamerTag: gamerTag
    },
    totalHours: 0,
    totalGames: 0,
    qualificationStatus: 'unknown',
    qualificationReason: 'PlayStation integration requires NPSSO token setup',
    topGames: [],
    error: 'PlayStation API not configured. Requires NPSSO token.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: GamerLookupRequest = await request.json();
    
    if (!body.gamerTag || !body.platform) {
      return NextResponse.json(
        { error: 'gamerTag and platform are required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${body.platform}:${body.gamerTag.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    let result: GamerLookupResponse;

    switch (body.platform) {
      case 'xbox':
        result = await lookupXboxPlayer(body.gamerTag);
        break;
      case 'steam':
        result = await lookupSteamPlayer(body.gamerTag);
        break;
      case 'playstation':
        result = await lookupPlayStationPlayer(body.gamerTag);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported platform. Use: xbox, steam, or playstation' },
          { status: 400 }
        );
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    // Clean expired cache entries
    for (const [key, value] of cache.entries()) {
      if (Date.now() - value.timestamp >= CACHE_TTL) {
        cache.delete(key);
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Gamer lookup error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to lookup gamer profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 