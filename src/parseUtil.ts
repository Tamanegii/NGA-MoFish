import * as JSON5 from 'json5';

const FIELD_STRIP_RE = /"(?:signature|alterinfo)"\s*:\s*"(?:[^"\\]|\\.)*"\s*,?/g;

export function stripProblematicFields(raw: string): string {
    let text = raw.replace(FIELD_STRIP_RE, '');
    text = text.replace(/,\s*,/g, ',');
    text = text.replace(/,\s*([}\]])/g, '$1');
    return text;
}

export function safeParseNgaJson(raw: string): any {
    let text = raw.replace(/^window\.script_muti_get_var_store=/, '');
    text = stripProblematicFields(text);
    try {
        return JSON5.parse(text);
    } catch (e1) {
        try {
            return JSON.parse(text);
        } catch (e2) {
            console.error('[NGA-MoFish] JSON parse failed:', e2);
            throw new Error(`解析NGA响应失败: ${(e2 as Error).message}`);
        }
    }
}

export function convertBBCodeInContent(content: string, stickerMode: string): string {
    content = content.replace(
        /\[img\]\.(\/[^\[]*?)\[\/img\]/g,
        '<img style="background-color: #FFFAFA" src="https://img.nga.178.com/attachments$1">'
    );
    content = content.replace(
        /\[img\](.*?)\[\/img\]/g,
        '<img style="background-color: #FFFAFA" src="$1">'
    );
    content = content.replace(
        /\[url\](.*?)\[\/url\]/g,
        '<a href="$1">url</a>'
    );
    if (stickerMode === '0') {
        content = content.replace(
            /<img\b[^>]*?src="([^"]+)"[^>]*?>/g,
            '<span class="nga-img-placeholder" data-src="$1">[图片] 点击加载</span>'
        );
    }
    return content;
}
