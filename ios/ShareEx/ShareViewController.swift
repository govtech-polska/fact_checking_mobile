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
  
  private func redirectToHostApp() {
    let url = URL(string: "ShareWithFH://dataUrl")
    var responder = self as UIResponder?
    let selectorOpenURL = sel_registerName("openURL:")
    
    while (responder != nil) {
      if (responder?.responds(to: selectorOpenURL))! {
        let _ = responder?.perform(selectorOpenURL, with: url)
      }
      responder = responder!.next
    }
    extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
  }
  
  private func setupInitialComponentValues() {
    if let item = extensionContext?.inputItems.first as? NSExtensionItem {
      if let attachments = item.attachments {
        for attachment: NSItemProvider in attachments {
          if attachment.hasItemConformingToTypeIdentifier("public.url") {
            attachment.loadItem(forTypeIdentifier: "public.url", options: nil, completionHandler: { [unowned self] (url, error) in
              if let shareURL = url as? URL {
                let userDefaults = UserDefaults(suiteName: "group.fakehunter.share")
                userDefaults?.set(shareURL.absoluteString, forKey: "shareUrl")
                userDefaults?.synchronize()
                self.redirectToHostApp()
              }
            })
          } else if attachment.hasItemConformingToTypeIdentifier("public.plain-text") {
            attachment.loadItem(forTypeIdentifier: "public.plain-text", options: nil, completionHandler: { [unowned self] text, error in
              if let text = text as? String, let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue) {
                let matches = detector.matches(in: text, options: [], range: NSRange(location: 0, length: text.utf16.count))
                for match in matches {
                  guard let range = Range(match.range, in: text) else { continue }
                  let url = text[range]
                  let userDefaults = UserDefaults(suiteName: "group.fakehunter.share")
                  userDefaults?.set(url, forKey: "shareUrl")
                  userDefaults?.synchronize()
                }
              }
              self.redirectToHostApp()
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
