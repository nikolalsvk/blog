import AppKit
import CoreText
import Foundation

let fontSize = CGFloat(Double(CommandLine.arguments[1]) ?? 55)
let outPath = CommandLine.arguments[2]
let sample = "\u{1F34D}\u{FE0F}"
let font = CTFontCreateWithName("Apple Color Emoji" as CFString, fontSize, nil)
let attrs: [NSAttributedString.Key: Any] = [.font: font]
let line = CTLineCreateWithAttributedString(NSAttributedString(string: sample, attributes: attrs))

var ascent: CGFloat = 0
var descent: CGFloat = 0
var leading: CGFloat = 0
let width = CGFloat(CTLineGetTypographicBounds(line, &ascent, &descent, &leading))
let widthPx = max(1, Int(ceil(width)))
let heightPx = max(1, Int(ceil(ascent + descent)))

let colorSpace = CGColorSpaceCreateDeviceRGB()
guard let ctx = CGContext(
  data: nil,
  width: widthPx,
  height: heightPx,
  bitsPerComponent: 8,
  bytesPerRow: 0,
  space: colorSpace,
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else {
  fputs("Could not draw the emoji.\n", stderr)
  exit(1)
}

ctx.textPosition = CGPoint(x: 0, y: descent)
CTLineDraw(line, ctx)

guard let image = ctx.makeImage(),
      let png = NSBitmapImageRep(cgImage: image).representation(using: .png, properties: [:])
else {
  fputs("Could not encode the emoji.\n", stderr)
  exit(1)
}

try png.write(to: URL(fileURLWithPath: outPath))
print("\(width) \(ascent) \(descent)")
