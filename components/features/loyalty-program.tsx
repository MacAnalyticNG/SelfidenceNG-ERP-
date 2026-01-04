"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Gift, Star } from "lucide-react"

interface LoyaltyProgramProps {
  customerName: string
  currentPoints: number
  nextTierPoints: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  totalSpent: number
}

export function LoyaltyProgram({ customerName, currentPoints, nextTierPoints, tier, totalSpent }: LoyaltyProgramProps) {
  const progressPercent = (currentPoints / nextTierPoints) * 100

  const tiers = {
    bronze: { color: "bg-amber-100", textColor: "text-amber-800", discount: "2%" },
    silver: { color: "bg-gray-100", textColor: "text-gray-800", discount: "5%" },
    gold: { color: "bg-yellow-100", textColor: "text-yellow-800", discount: "8%" },
    platinum: { color: "bg-purple-100", textColor: "text-purple-800", discount: "12%" },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Loyalty Program
        </CardTitle>
        <CardDescription>{customerName}'s rewards account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Tier */}
        <div className={`${tiers[tier].color} ${tiers[tier].textColor} p-4 rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold capitalize">{tier} Member</span>
            </div>
            <Badge>{tiers[tier].discount} Discount</Badge>
          </div>
          <p className="text-sm">Total Spent: ₦{totalSpent.toLocaleString()}</p>
        </div>

        {/* Points Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Points to Next Tier</span>
            <span className="text-gray-600">
              {currentPoints} / {nextTierPoints}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Rewards Available */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Available Rewards:</p>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• ₦{Math.floor((currentPoints / 10) * 100).toLocaleString()} in rewards credit</li>
            <li>• Free pressing service at {currentPoints >= 100 ? "available" : "50 more points"}</li>
            <li>• Birthday discount on next purchase</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
