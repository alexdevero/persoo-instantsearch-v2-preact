// https://www.algolia.com/doc/api-reference/widgets/powered-by/js/

export const renderPoweredByCustom = (renderOptions, isFirstRender) => {
  const { url, widgetParams } = renderOptions

  const widgetContainer = document.querySelector(widgetParams.container)

  widgetContainer.innerHTML = `
    <a class="persoo-powered-by-custom-link" href="${url}">
      <span>Powered by</span>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 680"><path fill="none" d="M356.824 351.132zM259.797 421.193c-.311-1.027-.556-2.07-.81-3.11.246 1.04.5 2.083.81 3.11zM351.732 347.959zM340.649 343.068c1.007.33 1.998.707 2.996 1.08-.998-.373-1.989-.75-2.996-1.08zM258.309 415.018zM346.33 345.25zM264.48 432.785zM369.856 363.164zM261.854 427.112c-.417-1.027-.786-2.084-1.154-3.147a61.19 61.19 0 001.154 3.147zM365.91 358.775a61.91 61.91 0 013.373 3.718 64.76 64.76 0 00-3.373-3.718zM361.547 354.758zM303.649 342.186zM309.567 340.838c.557-.095 1.122-.176 1.693-.267-.571.091-1.136.163-1.693.267zM297.96 344.071c.131-.058.271-.106.417-.168-.147.062-.286.111-.417.168zM383.789 395.811a63.103 63.103 0 00-10.413-27.927c5.493 8.152 9.095 17.661 10.307 27.927h.106zM257.752 395.273zM260.698 382.639a4.66 4.66 0 01.237-.639c-.09.213-.18.422-.237.639zM263.081 376.72c.024-.073.065-.139.098-.212-.033.073-.074.138-.098.212zM257.244 401.171c-.008.267.024.513.016.782a52.83 52.83 0 01.115-2.243c-.041.487-.106.966-.131 1.461zM257.465 408.616c-.09-.925-.114-1.851-.146-2.779.032.933.056 1.854.146 2.779zM328.519 340.339a63.886 63.886 0 000 0zM334.698 341.411zM322.968 339.859c-.287-.013-.572.024-.858.013.834.024 1.662.081 2.497.135-.559-.037-1.083-.123-1.639-.148zM258.905 388.827c.09-.377.205-.745.279-1.113-.074.368-.188.736-.279 1.113zM315.715 340.056c.736-.053 1.481-.077 2.243-.11-.761.032-1.506.057-2.243.11zM359.198 453.667l.115.188c13.31-10.164 22.479-25.491 24.524-43.078h-.154c-2.056 17.464-11.207 32.719-24.485 42.89zM276.228 448.584c.408.405.817.822 1.243 1.215l.041-.049c-.434-.393-.876-.761-1.284-1.166zM320.668 466.78c-11.297 0-21.889-2.992-31.082-8.165l-.049.064c8.595 4.875 18.451 7.846 29.002 8.215 9.913.349 19.343-1.67 27.856-5.443l-.074-.114c-7.85 3.472-16.509 5.443-25.653 5.443zM271.348 443.23c-.899-1.099-1.734-2.256-2.546-3.414.811 1.159 1.645 2.317 2.546 3.414zM275.539 447.93zM267.656 438.167c-.712-1.076-1.359-2.183-2.005-3.299.646 1.116 1.293 2.223 2.005 3.299z"/><path fill="#F8CA10" d="M318.539 466.895c-10.551-.369-20.407-3.34-29.002-8.215l-37.368 51.224c18.558 12.032 40.479 19.354 64.168 20.194 22.429.772 43.737-4.38 62.401-14.026l-32.342-54.62c-8.514 3.775-17.944 5.791-27.857 5.443z"/><path fill="#490B3D" d="M276.228 448.584a48.47 48.47 0 00-.688-.655 64.31 64.31 0 01-3.192-3.536 84.903 84.903 0 01-.999-1.162c-.899-1.098-1.734-2.256-2.546-3.414-.393-.547-.793-1.088-1.146-1.648-.712-1.076-1.359-2.182-2.005-3.299-.395-.688-.804-1.375-1.171-2.083a65.445 65.445 0 01-1.548-3.201c-.368-.826-.744-1.637-1.081-2.472-.417-1.027-.785-2.084-1.153-3.147a57.347 57.347 0 01-.901-2.771c-.311-1.027-.563-2.07-.81-3.11-.237-1.022-.476-2.034-.681-3.065a60.634 60.634 0 01-.45-3.004 58.778 58.778 0 01-.393-3.396c-.09-.926-.115-1.846-.146-2.779-.033-.847-.132-1.682-.132-2.546 0-.454.059-.884.074-1.338.008-.271-.023-.517-.016-.782.023-.495.09-.974.131-1.461.074-1.494.188-2.979.377-4.438.074-.549.164-1.102.253-1.642.246-1.62.54-3.233.9-4.805.09-.377.205-.745.278-1.113.441-1.72.934-3.422 1.515-5.075a4.66 4.66 0 01.237-.639 56.677 56.677 0 012.145-5.28c.024-.073.065-.139.098-.212a63.581 63.581 0 0134.781-32.438c.131-.058.271-.105.417-.168a65.713 65.713 0 015.272-1.719c.352-.099.694-.185 1.047-.271a62.115 62.115 0 014.871-1.076c.557-.103 1.122-.177 1.693-.267 1.475-.213 2.947-.405 4.454-.517.736-.053 1.481-.077 2.243-.11.9-.041 1.801-.14 2.709-.14.491 0 .958.054 1.441.066.286.012.572-.025.858-.013.558.024 1.08.11 1.638.147a58.32 58.32 0 013.912.332c.885.11 1.769.257 2.645.404 1.187.197 2.374.4 3.536.668.94.221 1.883.466 2.824.728 1.048.291 2.104.587 3.127.931 1.007.33 1.998.707 2.995 1.08.9.355 1.802.703 2.686 1.102 1.073.479 2.104.99 3.127 1.52.769.379 1.539.772 2.275 1.189a61.993 61.993 0 013.241 1.961c.622.401 1.245.798 1.851 1.212a62.339 62.339 0 013.299 2.476c.482.39.958.758 1.424 1.15a64.132 64.132 0 013.364 3.053c.328.315.671.636.999.967a63.46 63.46 0 013.373 3.717c.18.229.384.441.572.671a66.314 66.314 0 013.349 4.49c.057.082.115.155.172.229a63.103 63.103 0 0110.413 27.927h63.472c-.99-16.099-5.025-31.405-11.517-45.392a21.607 21.607 0 00-.975-2.313c-10.331-20.909-3.127-48.238-3.127-48.238v-.036l26.899-85.771c4.674-14.89-3.619-30.782-18.517-35.465-14.891-4.67-30.787 3.594-35.479 18.508l-23.911 76.333c-1.775 5.686-6.098 14.157-14.987 11.484-9.528-2.869-8.645-18.766-8.645-18.766l3.806-108.736c.606-17.354-12.966-31.912-30.328-32.514-17.347-.606-31.899 12.966-32.507 30.32l-3.79 108.826c-.277 7.563-2.374 16.244-9.822 17.943-8.841 2.029-12.059-12.283-12.476-14.428l-.058-.246v-.036l-16.062-81.314c-3.363-17.022-19.898-28.109-36.918-24.754-17.034 3.353-28.117 19.896-24.762 36.923l20.776 105.225c3.684 22.044 1.58 37.593-6.115 46.43-10.748 12.328-25.064 8.529-25.064 8.529l-26.661-8.124c-19.934-6.074-41.012 5.165-47.085 25.099-6.066 19.928 5.173 40.993 25.098 47.063l65.184 19.858c7.49 23.166 21.472 43.531 39.873 58.812l37.376-51.231c-.419-.395-.828-.812-1.236-1.217z"/><path fill="#BD1E51" d="M447.294 410.777h-63.457c-2.046 17.587-11.215 32.914-24.524 43.078l32.31 54.569c31.688-21.433 53.297-56.836 55.671-97.647z"/><path d="M557.935 331.645c5.55 0 10.167 1.188 13.784 3.521 3.644 2.386 5.484 5.473 5.484 9.314v9.644c3.626-6.213 9.176-11.837 16.699-16.879 7.458-5.014 16.372-7.531 26.637-7.531 7.924 0 15.414 1.724 22.47 5.153 7.081 3.409 13.171 8.12 18.295 14.096 5.141 6.017 9.227 12.909 12.223 20.734 2.979 7.821 4.478 16.199 4.478 25.213v26.305c0 8.566-1.539 16.813-4.642 24.718-3.103 7.937-7.235 14.943-12.353 21.041-5.157 6.106-11.092 10.97-17.837 14.612-6.736 3.639-13.851 5.431-21.356 5.431-9.626 0-18.295-2.541-26.006-7.678-7.703-5.129-13.049-11.015-16.053-17.665v80.27c0 3.406-2.079 6.473-6.237 9.16-4.176 2.666-9.168 4.012-14.964 4.012-5.976 0-10.821-1.346-14.588-4.012-3.757-2.688-5.632-5.754-5.632-9.16V344.482c0-3.845 1.875-6.931 5.632-9.315 3.765-2.335 8.398-3.522 13.966-3.522m78.656 63.264c0-3.644-.745-7.195-2.242-10.63-1.49-3.404-3.595-6.508-6.279-9.286a29.812 29.812 0 00-9.315-6.606c-3.52-1.584-7.317-2.382-11.37-2.382-3.421 0-6.802.614-10.126 1.915-3.348 1.285-6.253 3.223-8.823 5.788-2.57 2.563-4.658 5.606-6.254 9.127-1.612 3.554-2.424 7.563-2.424 12.074v32.093c0 1.73.688 3.896 2.097 6.564 1.375 2.677 3.389 5.32 5.926 7.861 2.562 2.596 5.575 4.785 9.013 6.606 3.397 1.825 7.171 2.729 11.224 2.729 3.848 0 7.499-.859 10.902-2.565 3.438-1.728 6.451-3.968 8.996-6.771 2.587-2.75 4.684-5.947 6.279-9.455 1.58-3.523 2.397-7.121 2.397-10.761v-26.301h-.001zM765.983 329.713c8.775 0 17.149 1.481 25.196 4.498 8.022 2.984 15.095 7.094 21.187 12.35 6.113 5.259 10.928 11.555 14.457 18.949 3.519 7.375 5.295 15.573 5.295 24.559 0 6.848-.836 12.217-2.579 16.063-1.718 3.849-3.995 6.681-6.9 8.493-2.897 1.821-6.099 2.95-9.618 3.393a91.824 91.824 0 01-10.771.627h-65.16v4.838c0 9.404 3.405 16.898 10.265 22.449 6.844 5.559 15.946 8.361 27.293 8.361 5.369 0 9.938-.65 13.81-1.911 3.839-1.313 7.261-2.685 10.256-4.183 3.004-1.52 5.714-2.898 8.187-4.176 2.48-1.285 4.879-1.939 7.236-1.939 2.342 0 4.485.654 6.434 1.939 1.908 1.276 3.562 2.891 4.978 4.806 1.358 1.956 2.448 3.97 3.208 6.091.736 2.156 1.114 3.97 1.114 5.463 0 2.779-1.326 5.739-4.003 8.821-2.709 3.104-6.491 6-11.387 8.688-4.961 2.661-10.896 4.884-17.846 6.582-6.958 1.706-14.702 2.541-23.279 2.541-11.33 0-21.774-1.543-31.304-4.646-9.512-3.103-17.714-7.539-24.549-13.322-6.853-5.771-12.197-12.729-16.062-20.85-3.854-8.146-5.771-17.133-5.771-26.984v-27.287c0-8.542 1.833-16.74 5.46-24.558 3.618-7.793 8.604-14.661 14.922-20.552 6.305-5.849 13.753-10.542 22.315-13.952 8.561-3.428 17.761-5.151 27.616-5.151m17.977 64.533c3.405 0 5.845-.528 7.219-1.608 1.409-1.044 2.088-3.426 2.088-7.048 0-7.495-2.774-13.601-8.357-18.296-5.559-4.719-12.213-7.08-19.875-7.08-7.293 0-13.776 2.238-19.434 6.749-5.697 4.485-8.513 10.604-8.513 18.299v8.984h46.872zM931.329 366.005c-4.715 0-9.241 1.117-13.662 3.364-4.379 2.219-8.292 5.415-11.723 9.472-3.405 4.061-6.188 9.032-8.348 14.914-2.121 5.886-3.186 12.495-3.186 19.765v57.47c0 3.221-2.096 6.196-6.262 8.987-4.191 2.813-9.168 4.166-14.932 4.166-5.992 0-10.887-1.354-14.604-4.166-3.749-2.791-5.633-5.768-5.633-8.987V344.48c0-3.844 1.884-6.93 5.633-9.314 3.716-2.333 8.611-3.521 14.604-3.521 5.141 0 9.512 1.188 13.146 3.521 3.643 2.386 5.46 5.473 5.46 9.314v13.168c1.498-3.405 3.602-6.787 6.254-10.105 2.709-3.318 5.722-6.328 9.16-8.992 3.422-2.673 7.161-4.81 11.247-6.446a35.162 35.162 0 0112.843-2.391h9.946c3.847 0 7.317 1.765 10.429 5.316 3.11 3.521 4.674 7.743 4.674 12.672s-1.563 9.192-4.674 12.844c-3.11 3.64-6.582 5.46-10.429 5.46l-9.943-.001zM1020.269 455.57c9.406 0 15.692-1.494 18.77-4.504 3.104-2.986 4.691-6.09 4.691-9.289 0-4.715-1.916-8.354-5.656-10.949-3.75-2.541-8.44-4.694-14.139-6.396a1211.577 1211.577 0 00-18.287-5.32c-6.531-1.793-12.629-4.27-18.287-7.377-5.681-3.104-10.396-7.297-14.137-12.67-3.74-5.347-5.591-12.513-5.591-21.5 0-5.771.95-11.511 2.856-17.18 1.925-5.677 5.149-10.764 9.652-15.277 4.469-4.471 10.428-8.166 17.803-11.06 7.375-2.89 16.43-4.335 27.154-4.335 6.393 0 12.721.523 18.934 1.604 6.213 1.076 11.623 2.521 16.348 4.339 4.706 1.821 8.505 4.019 11.41 6.589 2.882 2.56 4.33 5.346 4.33 8.334 0 1.485-.318 3.38-.975 5.615-.613 2.274-1.604 4.444-2.865 6.563-1.284 2.174-2.896 3.995-4.82 5.469-1.923 1.511-4.068 2.264-6.434 2.264-1.916 0-4.004-.486-6.256-1.428-2.25-1.008-4.82-2.052-7.701-3.222-2.897-1.19-6.059-2.235-9.455-3.218-3.438-.982-7.426-1.453-11.91-1.453-8.121 0-13.9 1.588-17.297 4.834-3.454 3.2-5.148 6.401-5.148 9.614 0 3.858 1.908 6.864 5.747 8.979 3.864 2.16 8.644 4.031 14.292 5.637a2207.951 2207.951 0 0018.492 5.137c6.631 1.824 12.777 4.436 18.443 7.865 5.646 3.431 10.437 8.08 14.301 13.962 3.863 5.881 5.736 13.543 5.736 22.948 0 14.351-5.059 25.739-15.209 34.217-10.183 8.447-24.795 12.65-43.811 12.65-8.169 0-15.758-.716-22.831-2.234-7.048-1.478-13.204-3.527-18.442-6.099-5.248-2.565-9.381-5.479-12.345-8.823-3.036-3.313-4.51-6.795-4.51-10.43 0-1.715.328-3.643.958-5.787.63-2.152 1.611-4.113 2.882-5.938a20.79 20.79 0 014.485-4.671c1.711-1.257 3.535-1.902 5.476-1.902 2.351 0 4.642.744 6.9 2.229 2.243 1.498 4.978 3.151 8.178 5.002 3.226 1.797 7.015 3.453 11.388 4.961 4.405 1.496 10.02 2.25 16.88 2.25M1165.688 329.713c9.209 0 18.066 1.724 26.481 5.153 8.474 3.409 15.922 8.12 22.313 14.096 6.418 6.017 11.525 12.909 15.268 20.735 3.732 7.82 5.624 16.199 5.624 25.212v26.305c0 8.566-1.892 16.813-5.624 24.718-3.741 7.937-8.85 14.943-15.268 21.041-6.393 6.106-13.842 10.971-22.313 14.612-8.415 3.64-17.272 5.431-26.481 5.431-9.422 0-18.344-1.791-26.815-5.431-8.448-3.644-15.823-8.456-22.134-14.452a69.229 69.229 0 01-15.088-20.869c-3.75-7.916-5.64-16.273-5.64-25.05v-26.305c0-8.579 1.833-16.813 5.468-24.746 3.644-7.916 8.611-14.873 14.922-20.874 6.313-5.977 13.721-10.739 22.144-14.26 8.474-3.551 17.511-5.316 27.143-5.316m28.276 65.196c0-3.644-.762-7.195-2.26-10.63a33.119 33.119 0 00-6.114-9.286c-2.569-2.783-5.542-4.989-8.987-6.606-3.438-1.584-7.049-2.382-10.912-2.382-3.855 0-7.49.798-10.912 2.382-3.404 1.617-6.4 3.823-8.996 6.606-2.569 2.778-4.616 5.882-6.098 9.286-1.481 3.435-2.234 6.986-2.234 10.63v26.305c0 3.845.753 7.539 2.234 11.084a30.382 30.382 0 006.098 9.319c2.596 2.661 5.592 4.854 8.996 6.582a24.129 24.129 0 0010.912 2.564c3.863 0 7.475-.858 10.912-2.564 3.445-1.729 6.418-3.921 8.987-6.582 2.586-2.689 4.616-5.791 6.114-9.319a28.206 28.206 0 002.26-11.084v-26.305zM1322.047 329.713c9.201 0 18.06 1.724 26.506 5.153 8.448 3.409 15.897 8.12 22.323 14.096 6.377 6.017 11.501 12.909 15.232 20.735 3.732 7.82 5.6 16.199 5.6 25.212v26.305c0 8.566-1.866 16.813-5.6 24.718-3.731 7.937-8.855 14.943-15.232 21.041-6.426 6.106-13.875 10.971-22.323 14.612-8.446 3.64-17.305 5.431-26.506 5.431-9.43 0-18.345-1.791-26.815-5.431-8.448-3.644-15.849-8.456-22.127-14.452-6.328-6-11.347-12.959-15.104-20.869-3.732-7.916-5.632-16.273-5.632-25.05v-26.305c0-8.579 1.834-16.813 5.461-24.746 3.642-7.916 8.618-14.873 14.946-20.874 6.295-5.977 13.694-10.739 22.125-14.26 8.474-3.551 17.502-5.316 27.146-5.316m28.272 65.196c0-3.644-.77-7.195-2.258-10.63a32.805 32.805 0 00-6.123-9.286 28.418 28.418 0 00-8.963-6.606c-3.431-1.584-7.065-2.382-10.93-2.382-3.855 0-7.498.798-10.92 2.382-3.413 1.617-6.426 3.823-8.963 6.606a32.735 32.735 0 00-6.115 9.286c-1.49 3.435-2.259 6.986-2.259 10.63v26.305c0 3.845.769 7.539 2.259 11.084 1.49 3.528 3.52 6.63 6.115 9.319 2.537 2.661 5.55 4.854 8.963 6.582a24.159 24.159 0 0010.92 2.564c3.863 0 7.499-.858 10.93-2.564 3.438-1.729 6.418-3.921 8.963-6.582 2.604-2.689 4.625-5.791 6.123-9.319 1.488-3.545 2.258-7.239 2.258-11.084v-26.305z"/></svg>
    </a>
  `
}
