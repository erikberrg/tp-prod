import ActivityKit
import WidgetKit
import SwiftUI

struct TrackPacerLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var distance: String
        var timeElapsed: String
    }

    var workoutType: String
}

struct TrackPacerLiveActivityLiveActivity: Widget {
  func formattedTime(_ raw: String) -> String {
      guard let seconds = Int(raw) else { return "\(raw)" }
      let minutes = seconds / 60
      let secs = seconds % 60
      return "\(minutes):\(secs)"
  }

  func formattedDistance(_ raw: String) -> String {
      guard let meters = Double(raw) else { return "\(raw)" }
      if meters >= 1000 {
          let km = meters / 1000
          return String(format: "%.2f", km)
      } else {
          return "\(Int(meters))"
      }
  }
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TrackPacerLiveActivityAttributes.self) { context in
          HStack {
              // Distance VStack
              VStack(alignment: .leading, spacing: 2) {
                  Text(formattedDistance(context.state.distance))
                      .font(.title)
                      .fontWeight(.bold)
                      .monospacedDigit()
                      .foregroundStyle(.white)

                  Text("Distance")
                      .font(.caption)
                      .foregroundStyle(.white.opacity(0.8))
              }

              Spacer().frame(width: 20)

              // Time VStack
              VStack(alignment: .leading, spacing: 2) {
                  Text(formattedTime(context.state.timeElapsed))
                  .font(.title)
                      .fontWeight(.bold)
                      .monospacedDigit()
                      .foregroundStyle(.white)

                  Text("Time")
                      .font(.caption)
                      .foregroundStyle(.white.opacity(0.8))
              }

              Spacer()

              RoundedRectangle(cornerRadius: 20)
                  .stroke(Color.white, lineWidth: 6)
                  .frame(width: 22, height: 40)
          }
          .padding(.horizontal, 24)
          .padding(.vertical, 12)
          .activityBackgroundTint(.black)
          .activitySystemActionForegroundColor(.white)

        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Text("\(context.state.distance) km")
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Text("\(context.state.timeElapsed) sec")
                        .monospacedDigit()
                }

                DynamicIslandExpandedRegion(.bottom) {
                    Text("Distance: \(context.state.distance)")
                }

            } compactLeading: {
                Text(formattedTime(context.state.timeElapsed))
                    .font(.caption2)
            } compactTrailing: {
                Text(formattedDistance(context.state.distance))
                    .font(.caption2)
            } minimal: {
              Text(formattedDistance(context.state.distance))
                  .font(.caption2)
            }
            .widgetURL(URL(string: "trackpacer://open"))
            .keylineTint(.blue)
        }
    }
}
