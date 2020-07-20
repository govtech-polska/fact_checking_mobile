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
