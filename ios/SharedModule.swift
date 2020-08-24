//
//  SharedModule.swift
//  FakeHunter
//
//  Created by Kamil Cichuta on 20/07/2020.
//

import Foundation
@objc(SharedModule) class SharedModule: NSObject {
  
  let groupId = "group.fakehunter.share"
  let shareKey = "shareUrl"
  let openKey = "openUrl"
  
  @objc func getShareUrl(_ callback: RCTResponseSenderBlock) {
    if let sharedDefaults = UserDefaults(suiteName: groupId) {
      let url = sharedDefaults.string(forKey: shareKey)
      if (url != nil) {
        return callback([NSNull(), url])
      }
    }
  }
  
  @objc func clearShareUrl() {
    if let sharedDefaults = UserDefaults(suiteName: groupId) {
      sharedDefaults.set(nil, forKey: shareKey)
      sharedDefaults.synchronize()
    }
  }
  
  @objc func getOpenUrl(_ callback: RCTResponseSenderBlock) {
    let sharedDefaults = UserDefaults.standard
    let url = sharedDefaults.string(forKey: openKey)
    if (url != nil) {
      return callback([NSNull(), url])
    }
  }
  
  @objc func clearOpenUrl() {
    let sharedDefaults = UserDefaults.standard
    sharedDefaults.set(nil, forKey: openKey)
    sharedDefaults.synchronize()
  }
  
}
