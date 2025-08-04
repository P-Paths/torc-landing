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
    return {
      platform: 'xbox',
      player: {
        gamerTag: gamerTag
      },
      totalHours: 0,
      totalGames: 0,
      qualificationStatus: 'unknown',
      qualificationReason: 'Xbox API key not configured. Add OPENXBL_API_KEY to .env.local',
      topGames: [],
      error: 'Xbox API key not configured'
    };
  }

  try {
    // Xbox player profile lookup using correct OpenXBL endpoint
    const searchResponse = await fetch(`https://xbl.io/api/v2/search/${encodeURIComponent(gamerTag)}`, {
      headers: {
        'X-Authorization': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      return {
        platform: 'xbox',
        player: {
          gamerTag: gamerTag
        },
        totalHours: 0,
        totalGames: 0,
        qualificationStatus: 'not_qualified',
        qualificationReason: 'Xbox user not found',
        topGames: []
      };
    }

    const searchData = await searchResponse.json();
    
    // If we found the user, get their detailed profile
    if (searchData.length > 0) {
      const user = searchData[0];
      const xuid = user.xuid || user.id;
      
      // Get detailed profile using the account endpoint
      const profileResponse = await fetch(`https://xbl.io/api/v2/account/${xuid}`, {
        headers: {
          'X-Authorization': apiKey,
          'Accept': 'application/json'
        }
      });

      let profileData: any = {};
      if (profileResponse.ok) {
        profileData = await profileResponse.json();
      }

      // Extract data from the people array structure
      const people = profileData.people?.[0];
      
      return {
        platform: 'xbox',
        player: {
          gamerTag: people?.gamertag || user.gamertag || gamerTag,
          gamerscore: parseInt(people?.gamerScore) || 0,
          profilePicture: people?.displayPicRaw
        },
        totalHours: 0, // Xbox doesn't provide total hours
        totalGames: 0,
        qualificationStatus: 'qualified',
        qualificationReason: 'Xbox user found and verified',
        topGames: []
      };
    } else {
      return {
        platform: 'xbox',
        player: {
          gamerTag: gamerTag
        },
        totalHours: 0,
        totalGames: 0,
        qualificationStatus: 'not_qualified',
        qualificationReason: 'Xbox user not found',
        topGames: []
      };
    }
  } catch (error) {
    console.error('Xbox lookup error:', error);
    return {
      platform: 'xbox',
      player: {
        gamerTag: gamerTag
      },
      totalHours: 0,
      totalGames: 0,
      qualificationStatus: 'unknown',
      qualificationReason: `Xbox API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      topGames: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function lookupSteamPlayer(gamerTag: string): Promise<GamerLookupResponse> {
  const apiKey = process.env.STEAM_API_KEY;
  
  if (!apiKey) {
    // Return a more informative error for missing API key
    return {
      platform: 'steam',
      player: {
        gamerTag: gamerTag
      },
      totalHours: 0,
      totalGames: 0,
      qualificationStatus: 'unknown',
      qualificationReason: 'Steam API key not configured. Add STEAM_API_KEY to .env.local',
      topGames: [],
      error: 'Steam API key not configured'
    };
  }

  try {
    // Steam ID lookup by vanity name
    const idResponse = await fetch(
      `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(gamerTag)}`
    );
    
    if (!idResponse.ok) {
      throw new Error(`Steam API error: ${idResponse.status}`);
    }
    
    const idData = await idResponse.json();
    
    if (idData.response.success !== 1) {
      return {
        platform: 'steam',
        player: {
          gamerTag: gamerTag
        },
        totalHours: 0,
        totalGames: 0,
        qualificationStatus: 'not_qualified',
        qualificationReason: 'Steam user not found',
        topGames: []
      };
    }

    const steamId = idData.response.steamid;

    // Get player summary
    const playerResponse = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
    );
    
    if (!playerResponse.ok) {
      throw new Error(`Steam API error: ${playerResponse.status}`);
    }
    
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
    return {
      platform: 'steam',
      player: {
        gamerTag: gamerTag
      },
      totalHours: 0,
      totalGames: 0,
      qualificationStatus: 'unknown',
      qualificationReason: `Steam API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      topGames: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function lookupPlayStationPlayer(gamerTag: string): Promise<GamerLookupResponse> {
  // Mock PlayStation response for testing
  return {
    platform: 'playstation',
    player: {
      gamerTag: gamerTag,
      profilePicture: 'https://via.placeholder.com/150'
    },
    totalHours: 650,
    totalGames: 28,
    qualificationStatus: 'qualified',
    qualificationReason: `PlayStation shows ${650} total hours of gaming`,
    topGames: [
      {
        name: 'God of War Ragnarök',
        hoursPlayed: 120,
        platform: 'playstation'
      },
      {
        name: 'Spider-Man 2',
        hoursPlayed: 100,
        platform: 'playstation'
      },
      {
        name: 'Call of Duty: Modern Warfare III',
        hoursPlayed: 200,
        platform: 'playstation'
      },
      {
        name: 'FIFA 24',
        hoursPlayed: 150,
        platform: 'playstation'
      },
      {
        name: 'Gran Turismo 7',
        hoursPlayed: 80,
        platform: 'playstation'
      }
    ]
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') as 'xbox' | 'playstation' | 'steam';
    const username = searchParams.get('username');
    
    if (!username || !platform) {
      return NextResponse.json(
        { error: 'platform and username are required' },
        { status: 400 }
      );
    }

    const body = { gamerTag: username, platform };
    
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