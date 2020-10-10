
// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (idStr, title) {
      var title = this.htmlTitle
      const msg = this.$Message.loading({
        content: 'PDF导出中...',
        duration: 0
      });
      setTimeout(msg, 3000);
      html2Canvas(document.querySelector('#' + idStr), {
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
      // Create a canvas with double-resolution.
      html2Canvas(document.querySelector('#' + idStr), {
        scale: 2,
      });
      // Create a canvas with 144 dpi (1.5x resolution).
      html2Canvas(document.querySelector('#' + idStr), {
        dpi: 144,
      });
    }
  }
}
