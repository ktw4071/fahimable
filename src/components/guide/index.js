import { transform, i18n, lan } from '../../unit/const'
import { isMobile } from '../../unit'

export default {
  name: 'Guide',
  data() {
    return {
      isMobile: isMobile(),
      IPAdd: 'BE'
    }
  },
  computed: {
    linkTitle: () => i18n.linkTitle[lan],
    github: () => i18n.github[lan],
    QRCode: () => i18n.QRCode[lan],
    QRTitle: () => i18n.QRNotice[lan],
    QRSrc: () =>
      window.location.protocol +
      '//binaryify.github.io/vue-tetris/static/qr.jpeg'
  },
  created() {
    
  },
  mounted() {
    window.addEventListener('resize', this.resize.bind(this), true)
    // getUserIP(function(ip){
    //   this.IPAdd = ip
    //   console.log("ip - " + ip)
    //   console.log("IPAdd - " + this.IPAdd)
    // })
  },
  methods: {
    resize() {
      this.isMobile = isMobile()
    },

    getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
      //compatibility for firefox and chrome
      var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
          iceServers: []
      }),
      noop = function() {},
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

      function iterateIP(ip) {
          if (!localIPs[ip]) onNewIP(ip);
          localIPs[ip] = true;
      }

       //create a bogus data channel
      pc.createDataChannel("");

      // create offer and set local description
      pc.createOffer().then(function(sdp) {
          sdp.sdp.split('\n').forEach(function(line) {
              if (line.indexOf('candidate') < 0) return;
              line.match(ipRegex).forEach(iterateIP);
          });
          
          pc.setLocalDescription(sdp, noop, noop);
      }).catch(function(reason) {
          // An error occurred, so handle the failure to connect
      });

      //listen for candidate events
      pc.onicecandidate = function(ice) {
          if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
          ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    }
  }
}
