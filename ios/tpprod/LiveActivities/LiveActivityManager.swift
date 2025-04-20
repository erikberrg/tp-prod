import Foundation
import ActivityKit
import WidgetKit

@objc(LiveActivityManager)
@available(iOS 16.1, *)
class LiveActivityManager: NSObject {
  static var activity: Activity<TrackPacerLiveActivityAttributes>?

  @objc
  func startActivity(_ distance: NSString, timeElapsed: NSString) {
    let attributes = TrackPacerLiveActivityAttributes(workoutType: "Run")
    let contentState = TrackPacerLiveActivityAttributes.ContentState(
      distance: distance as String,
      timeElapsed: timeElapsed as String
    )

    do {
      Self.activity = try Activity<TrackPacerLiveActivityAttributes>.request(
        attributes: attributes,
        contentState: contentState,
        pushType: nil
      )
      print("✅ Live Activity started")
    } catch {
      print("❌ Failed to start Live Activity: \(error)")
    }
  }

  @objc
  func updateActivity(_ distance: NSString, timeElapsed: NSString) {
    Task {
      let newState = TrackPacerLiveActivityAttributes.ContentState(
        distance: distance as String,
        timeElapsed: timeElapsed as String
      )
      await Self.activity?.update(using: newState)
    }
  }

  @objc
  func endActivity() {
    Task {
      await Self.activity?.end(dismissalPolicy: .immediate)
      print("✅ Live Activity ended")
    }
  }
}
