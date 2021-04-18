//
//  ViewController.swift
//  SafLighter
//
//  Copyright © 2021, Firmin Launay (FLA Coding).
//

import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager
import Foundation

@discardableResult
func shell(_ args: String...) -> Int32 {
    let task = Process()
    task.launchPath = "/usr/bin/env"
    task.arguments = args
    task.launch()
    task.waitUntilExit()
    return task.terminationStatus
}

let extensionBundleIdentifier = "com.github.FLA-Coding.SafLighter.Extension"

class ViewController: NSViewController {
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                shell("osascript", "-e", "display alert \"We could not open Safari. Something went wrong ☹️\"")
                return
            }

            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        }
    }
    @IBAction func openRepo(_ sender: AnyObject?) {
        shell("open", "https://github.com/FLA-Coding/SafLighter")
    }
}

class ContactController: NSViewController {
    @IBAction func submitIssue(_ sender: AnyObject?) {
        shell("open", "https://github.com/FLA-Coding/SafLighter/issues/new")
    }
    @IBAction func sendMail(_ sender: AnyObject?) {
        shell("open", "mailto:fla.coding@post.com")
    }
    @IBAction func twitter(_ sender: AnyObject?) {
        shell("open", "https://twitter.com/FLA_Coding")
    }
}

class AboutMenu: NSViewController {
    @IBAction func openGitHub(_ sender: AnyObject?) {
        shell("open", "https://github.com/FLA-Coding/SafLighter")
    }
    @IBAction func showLicense(_ sender: AnyObject?) {
        let path = Bundle.main.path(forResource: "LICENSE", ofType: "pdf")
        shell("open", path!)
    }
    @IBAction func showCopyright(_ sender: AnyObject?) {
        let path = Bundle.main.path(forResource: "COPYING", ofType: "pdf")
        shell("open", path!)
    }
}
