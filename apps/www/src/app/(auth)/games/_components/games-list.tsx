"use client";

import { Card } from "@/components/ui/card";
import { type GameResponse } from "@renegade-fanclub/types";
import Link from "next/link";

export function GamesList({ games }: { games: GameResponse[] }) {
  if (!games.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No current games available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`}>
          <Card className="p-6 hover:opacity-90 transition-all">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div 
                  className="flex-1 p-4 rounded-lg" 
                  style={{
                    background: game.homeTeamMetadata?.colors?.primary || '#666666',
                    color: '#FFFFFF',
                    boxShadow: `0 4px 6px -1px ${game.homeTeamMetadata?.colors?.primary || '#666666'}33`
                  }}
                >
                  <h3 className="font-bold text-lg">{game.homeTeamName}</h3>
                  <p className="text-sm opacity-80">Home Team</p>
                </div>
                
                <div className="text-center px-6 py-2">
                  <span className="text-2xl font-black bg-gray-900 text-white px-4 py-2 rounded-full">VS</span>
                  <p className="text-sm text-gray-600 mt-2">
                    {new Date(game.startTime).toLocaleDateString()}
                  </p>
                </div>
                
                <div 
                  className="flex-1 p-4 rounded-lg text-right" 
                  style={{
                    background: game.awayTeamMetadata?.colors?.primary || '#666666',
                    color: '#FFFFFF',
                    boxShadow: `0 4px 6px -1px ${game.awayTeamMetadata?.colors?.primary || '#666666'}33`
                  }}
                >
                  <h3 className="font-bold text-lg">{game.awayTeamName}</h3>
                  <p className="text-sm opacity-80">Away Team</p>
                </div>
              </div>

              <div className="text-center space-y-2">
                {typeof game.apiMetadata === 'object' && game.apiMetadata !== null && 'location' in game.apiMetadata && (
                  <p className="text-sm text-gray-600">{game.apiMetadata.location as string}</p>
                )}
                {typeof game.apiMetadata === 'object' && game.apiMetadata !== null && 'conference' in game.apiMetadata && (
                  <p className="text-xs font-semibold text-gray-500">{game.apiMetadata.conference as string} Championship</p>
                )}
                {game.status === "completed" ? (
                  <div className="bg-gray-100 rounded-full px-4 py-2 inline-block">
                    <span className="font-semibold">
                      Winner: {game.winnerTeamId === game.homeTeamId 
                        ? game.homeTeamName 
                        : game.awayTeamName}
                    </span>
                  </div>
                ) : (
                  <div 
                    className="bg-gray-900 text-white rounded-full px-6 py-2 inline-block mt-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(45,45,45,0.9) 100%)'
                    }}
                  >
                    <span className="font-bold">{game.pointsValue} Points</span>
                  </div>
                )}
            </div>
          </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
