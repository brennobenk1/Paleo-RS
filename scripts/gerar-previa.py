#!/usr/bin/env python3
"""
Paleo-RS — scripts/gerar-previa.py

Junta index.html, css/estilo.css e js/*.js num único arquivo
autocontido, para visualizar ou publicar sem servidor.
Artefato gerado: não edite previa.html.
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
html = (RAIZ / "index.html").read_text(encoding="utf-8")
css = (RAIZ / "css" / "estilo.css").read_text(encoding="utf-8")
dados = (RAIZ / "js" / "dados.js").read_text(encoding="utf-8")
app = (RAIZ / "js" / "app.js").read_text(encoding="utf-8")
malha = (RAIZ / "js" / "malha.js").read_text(encoding="utf-8")

# a logo entra como data URI: a prévia tem de ser um arquivo só
logo = (RAIZ / "imgs" / "logo-vet.svg").read_text(encoding="utf-8")
import base64
logo_uri = "data:image/svg+xml;base64," + base64.b64encode(logo.encode("utf-8")).decode()
html = html.replace('href="imgs/logo-vet.svg"', f'href="{logo_uri}"')
html = html.replace('src="imgs/logo-vet.svg"', f'src="{logo_uri}"')

html = html.replace('<link rel="stylesheet" href="css/estilo.css">',
                    f"<style>\n{css}\n</style>")
html = html.replace('<script src="js/malha.js"></script>',
                    f"<script>\n{malha}\n</script>")
html = html.replace('<script src="js/dados.js"></script>',
                    f"<script>\n{dados}\n</script>")
html = html.replace('<script defer src="js/app.js"></script>',
                    f"<script defer>\n{app}\n</script>")

destino = RAIZ / "previa.html"
destino.write_text(html, encoding="utf-8")
print(f"{destino.relative_to(RAIZ)} — {len(html) // 1024} KB")
