#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LiveActivityManager, NSObject)

RCT_EXTERN_METHOD(startActivity:(NSString *)distance timeElapsed:(NSString *)timeElapsed)
RCT_EXTERN_METHOD(updateActivity:(NSString *)distance timeElapsed:(NSString *)timeElapsed)
RCT_EXTERN_METHOD(endActivity)

@end
