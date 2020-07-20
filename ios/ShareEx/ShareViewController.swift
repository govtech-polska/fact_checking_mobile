//
//  ShareViewController.swift
//  ShareEx
//
//  Created by Kamil Cichuta on 20/07/2020.
//

import UIKit
import Social

class ShareViewController: UIViewController {
  
  // MARK: Lifecycle
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    navigationController?.setNavigationBarHidden(true, animated: false)
    setupInitialComponentValues()
  }
  
  private func setupInitialComponentValues() {
    if let item = extensionContext?.inputItems.first as? NSExtensionItem {
      if let attachments = item.attachments {
            for attachment: NSItemProvider in attachments {
                if attachment.hasItemConformingToTypeIdentifier("public.url") {
                  attachment.loadItem(forTypeIdentifier: "public.url", options: nil, completionHandler: { (url, error) in
                        if let shareURL = url as? URL {
                          let userDefaults = UserDefaults(suiteName: "group.fakehunter.share")
                          userDefaults?.set(shareURL.absoluteString, forKey: "shareUrl")
                          userDefaults?.synchronize()
                        }
                    })
                } else if attachment.hasItemConformingToTypeIdentifier("public.plain-text") {
                  attachment.loadItem(forTypeIdentifier: "public.plain-text", options: nil, completionHandler: { url, error in
                      let userDefaults = UserDefaults(suiteName: "group.fakehunter.share")
                      userDefaults?.set(url, forKey: "shareUrl")
                      userDefaults?.synchronize()
                  })
               }
            }
        }
    }
  }
}

@objc(CustomShareNavigationController)
class CustomShareNavigationController: UINavigationController {
  
  override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    
    self.setViewControllers([ShareViewController()], animated: false)
  }
  
  @available(*, unavailable)
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }
}
