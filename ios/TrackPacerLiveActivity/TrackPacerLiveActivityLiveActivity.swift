//
//  TrackPacerLiveActivityLiveActivity.swift
//  TrackPacerLiveActivity
//
//  Created by Erik Berg on 4/18/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct TrackPacerLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct TrackPacerLiveActivityLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TrackPacerLiveActivityAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension TrackPacerLiveActivityAttributes {
    fileprivate static var preview: TrackPacerLiveActivityAttributes {
        TrackPacerLiveActivityAttributes(name: "World")
    }
}

extension TrackPacerLiveActivityAttributes.ContentState {
    fileprivate static var smiley: TrackPacerLiveActivityAttributes.ContentState {
        TrackPacerLiveActivityAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: TrackPacerLiveActivityAttributes.ContentState {
         TrackPacerLiveActivityAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: TrackPacerLiveActivityAttributes.preview) {
   TrackPacerLiveActivityLiveActivity()
} contentStates: {
    TrackPacerLiveActivityAttributes.ContentState.smiley
    TrackPacerLiveActivityAttributes.ContentState.starEyes
}
