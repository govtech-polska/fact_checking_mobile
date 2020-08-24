//
//  SharedModule.m
//  FakeHunter
//
//  Created by Kamil Cichuta on 20/07/2020.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(SharedModule,NSObject)
RCT_EXTERN_METHOD(getShareUrl: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(clearShareUrl)
RCT_EXTERN_METHOD(getOpenUrl: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(clearOpenUrl)
@end
