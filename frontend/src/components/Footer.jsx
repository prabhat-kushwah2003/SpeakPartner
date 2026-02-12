import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t px-8 py-6">
      {/* Top Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Logo + Copyright */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded-lg font-bold">
              SP
            </div>
            <h1 className="font-bold text-lg">SpeakPartner</h1>
          </div>

          <p className="text-xs text-gray-500">
            © 2026 SpeakPartner. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-gray-600 text-sm">
          <span className="hover:text-purple-600 cursor-pointer">Privacy</span>
          <span className="hover:text-purple-600 cursor-pointer">Terms</span>
          <span className="hover:text-purple-600 cursor-pointer">Support</span>
          <span className="hover:text-purple-600 cursor-pointer">About</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500">
          <Facebook
            size={18}
            className="cursor-pointer hover:text-purple-600"
          />
          <Twitter size={18} className="cursor-pointer hover:text-purple-600" />
          <Instagram
            size={18}
            className="cursor-pointer hover:text-purple-600"
          />
          <Linkedin
            size={18}
            className="cursor-pointer hover:text-purple-600"
          />
        </div>
      </div>

      {/* Bottom Text
      <div className="text-center text-gray-400 text-sm mt-6 border-t pt-4">
        Made with ❤️ for language learners everywhere
      </div> */}
    </footer>
  );
}

export default Footer;
