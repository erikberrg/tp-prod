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
      guard let seconds = Int(raw) else { return "\(raw)s" }
      let minutes = seconds / 60
      let secs = seconds % 60
      return "\(minutes)m \(secs)s"
  }

  func formattedDistance(_ raw: String) -> String {
      guard let meters = Double(raw) else { return "\(raw)m" }
      if meters >= 1000 {
          let km = meters / 1000
          return String(format: "%.2f km", km)
      } else {
          return "\(Int(meters)) m"
      }
  }
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TrackPacerLiveActivityAttributes.self) { context in
            // Lock screen/banner Live Activity UI
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Track Pacer")
                        .font(.headline)
                        .foregroundStyle(.white)

                  Text("Distance: \(formattedDistance(context.state.distance))")
                      .font(.subheadline)
                      .fontWeight(.bold)
                      .italic()
                      .foregroundStyle(.white)

                  Text("Time: \(formattedTime(context.state.timeElapsed))")
                      .font(.subheadline)
                      .fontWeight(.bold)
                      .italic()
                      .foregroundStyle(.white)
                }

                Spacer()

                Button(action: {
                    // Action could be handled via deep link in full app
                }) {
                    Image(systemName: "stop.fill")
                        .resizable()
                        .frame(width: 16, height: 16)
                        .padding(16)
                        .background(Color.red)
                        .clipShape(Circle())
                }
                .foregroundColor(.white)
            }
            .padding(.horizontal, 16)
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
                Text("🏃")
            }
            .widgetURL(URL(string: "trackpacer://open"))
            .keylineTint(.blue)
        }
    }
}
